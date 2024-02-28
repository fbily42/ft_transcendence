
import { JwtService } from '@nestjs/jwt';
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { WsExceptionFilter } from './chat/filter/ws-exception.filter';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js';
import * as cookie from 'cookie';
import { InviteChannelDto, ChannelCmdDto, MessageDto } from './chat/dto';
import { ChatService } from './chat/chat.service';
import { GameStat } from './Game/Game.types';
import { quitCmdDto } from './chat/dto/quitCmd.dto';

@UsePipes(new ValidationPipe())
@UseFilters(new WsExceptionFilter())
@WebSocketGateway(8081, {
	cors: {
		origin: `${process.env.FRONTEND_URL}`,
		credentials: true,
	},
	transports: ['websocket', 'polling'],
	})
	  
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	
	@WebSocketServer()
	server: Server;

	clients = new Map<string, string[]>();
	games_room = new Map<string, string[]>();
	games_info = new Map<string , GameStat>();
	

	constructor (private jwtService: JwtService,
		private prisma: PrismaService,
		private chatService: ChatService) {
			this.server = new Server();
		}
		

	getClientsAsArray(): {key: string, value: string[]}[] {
		const clientsArray = [];
	
		for (const [key, value] of this.clients.entries()) {
			clientsArray.push({key: key, value: value});
		}
	
		return clientsArray;
	}

	async handleConnection(client: Socket) {
		
		try {
			const cookiestr = client.handshake.headers.cookie;
			if (!cookiestr)
				throw new Error('JWT is missing')
			const parsedcookie = cookie.parse(cookiestr);
			const jwt = parsedcookie['jwt'];
	
			const decode = this.jwtService.verify(jwt);

			client.data = { userId: decode.sub, userName: decode.login };
			const clientIds = this.clients.get(client.data.userName);
			if (clientIds)
				clientIds.push(client.id)
			else
				this.clients.set(client.data.userName, [client.id])
			this.server.emit('users', this.getClientsAsArray())
		} catch (error) {
			client.emit('exception', error.message);
			client.disconnect();
		}
	}

	handleDisconnect(client: Socket) {
		const clientIds = this.clients.get(client.data.userName)
		if (clientIds)
		{
			const newIds = clientIds.filter(id => id !== client.id)
			if (newIds.length > 0)
				this.clients.set(client.data.userName, newIds);
			else
				this.clients.delete(client.data.userName)
		}
		this.server.emit("users", this.getClientsAsArray())
	}

	@SubscribeMessage('messageToRoom')
	async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() message: MessageDto){
		try {
			if (client.rooms.has(message.target)){
				const messages = await this.chatService.createMessage(message)
				this.server.to(message.target).emit('messageToRoom', message.target);
			}
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError)
				throw new WsException(`Prisma error code : ${error.code}`);
			throw new WsException('Internal Server Error');
		}
	}

	@SubscribeMessage('joinChannel')
	join(@ConnectedSocket() client: Socket, @MessageBody() name: string){
		const rooms = client.rooms;
		if (name){
			if (rooms.has(name))
				return ;
			client.join(name);
			this.server.to(name).emit('updateChannelUsers')
		}
	}

	@SubscribeMessage('newChannelUser')
	updateUserList(@ConnectedSocket() client: Socket, @MessageBody() channel: string){
		this.server.to(channel).emit('updateChannelUsers')
	}

	@SubscribeMessage('newChannel')
	newChannel(@ConnectedSocket() client: Socket){
		const clientIds = this.clients.get(client.data.userName)
		if (clientIds){
			clientIds.forEach(socketId => {
				this.server.to(socketId).emit('updateChannelList')
			})
		}
	}


	//possible probleme
	//si une personne cree une room elle peut pas en rejoindre une 
	//si une personne veux annuler sa recherche comment faire
	//que se passe t il si elle spam un bouton 
	//si elle est en partie ne rien faire
	//verifier le login de la personne pour l'empecher de faire deux matchmaking
	@SubscribeMessage('JoinRoom')
	joingame(@ConnectedSocket() client: Socket, @MessageBody() room: string)
	{
		try{
			for (let [key, value] of this.games_room)
			{
				let stringcount = 0;
				for (let item of value){
					if (typeof item === 'string')
						stringcount++;
					if (stringcount === 2)
						break;
				}
				if (stringcount < 2)
				{
					if (value[0] != client.id)
					{
						client.join(key);
						let array = this.games_room.get(key);
						array.push(client.id);
						this.games_room.set(key, array);
						this.server.to(client.id).emit('JoinParty', `You have joined room : ${key}`)
						// console.log("nom de la room", key);
						this.server.to(key).emit('Ready', key);
						this.server.to(value[0]).emit('JoinParty', 'Ready');
						return ;
	
					}
					else
						return;
				}
			}
			this.games_room.set(room, [client.id]);
			client.join(room);
			// console.log(`room : ${room}`)
			this.server.to(client.id).emit('JoinParty', `You have created a room : ${room}`);
			return ;

		}
		catch (error)
		{
			throw new WsException('Internal Server Error');
		}
	}

	@SubscribeMessage('CreateGameinfo')
	CreateGameinfo(@ConnectedSocket() client: Socket, @MessageBody() room:string)
	{
		try{

			if (this.games_info.has(room)){
				// console.log('la data existe');
				this.server.to(client.id).emit('UpdateKey', this.games_info.get(room))
			}
			else{
				this.games_info.set(room, new GameStat());
				this.server.to(client.id).emit('UpdateKey', this.games_info.get(room))
			}
		}
		catch(error)
		{
			throw new WsException('Internal Server Error')

		}
	}

	@SubscribeMessage('ballMov')
	ballMov(@ConnectedSocket() client: Socket, @MessageBody() room: string)
	{
		try {

			// const now = Date.now();
			// const delay = 10;
			let gamestat:GameStat = this.games_info.get(room);
			// if (now - gamestat.ball.last > delay)
			// {
				// gamestat.ball.last = now;
				gamestat.ball.x += gamestat.ball.dx * gamestat.ball.speed;
				gamestat.ball.y += gamestat.ball.dy * gamestat.ball.speed;
				
				gamestat.WallCollision();
			// }
			// gamestat.PaddleCollision(gamestat.paddle_1);
			// gamestat.PaddleCollision(gamestat.paddle_2);
	
			this.games_info.set(room, gamestat);
			this.server.to(room).emit('UpdateKey', gamestat);
		}
		catch(error)
		{
			throw new WsException('Internal Server Error')
		}

	}

	//faire le cas ou une personne quitte
	//le cas ou c'est la fin de la partie 
	@SubscribeMessage('leaveRoom')
	leaveRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string)
	{
		try {

			let gamestat:GameStat = this.games_info.get(room);//il faut supprimer la roomm et le Gamestat
			let games_room = this.games_room;//il faut supprimer la room pour mettre a la personne de pouvoir relancer un matchmaking
			let clients  = this.clients;//utilie les clientid dans games_room pour savoir qui a quitte la game avant la fin pour savoir si il y a quelqu'un a penalise
			
			// for (let [key , value ] of this.games_room)
			// {
			// 	if (key == room)
			// 	{
					
			// 	}
				
			// }
			this.games_room.delete(room);
			this.games_info.delete(room);
		}
		catch(error)
		{
			throw new WsException('Internal Server Error')
		}

	}

	@SubscribeMessage('paddllColl')
	paddllColl(@ConnectedSocket() client: Socket, @MessageBody() room: string)
	{
		try {

			let gamestat:GameStat = this.games_info.get(room);
			gamestat.PaddleCollision(gamestat.paddle_1);
			gamestat.PaddleCollision(gamestat.paddle_2);
			this.games_info.set(room, gamestat);
			this.server.to(room).emit('UpdateKey', gamestat);
		}
		catch(error)
		{
			throw new WsException('Internal Server Error')
		}
	}
	
	@SubscribeMessage('key')
	UpdateKey(@ConnectedSocket() client: Socket, @MessageBody() data: { key: string; roomId: string })
	{
		try {

			let gamestat:GameStat = this.games_info.get(data.roomId)
			let array = this.games_room.get(data.roomId);
			// if(array[0] == client.id)
			// {
	
				if (data.key === "a") {
					if ((gamestat.paddle_1.y - 10) > 0 )
						gamestat.paddle_1.y -= 5;
					}
	
				else if (data.key === "d") {
					if ((gamestat.paddle_1.y + 10 + 60) < gamestat.canvas.height )
					{
						gamestat.paddle_1.y += 5;
					}
				}
				// else
				// 	return;
	
			// }
			// if(array[1] == client.id)
			// {
				if (data.key === "ArrowUp" ) {
					if ((gamestat.paddle_2.y - 10) > 0 )
						gamestat.paddle_2.y -= 5;
					}
		
				else if (data.key === "ArrowDown") {
					if ((gamestat.paddle_2.y + 10 + 60) < gamestat.canvas.height )
					{
						gamestat.paddle_2.y += 5;
					}
				}
				// else
				// return;
	
			// }
	
			this.games_info.set(data.roomId, gamestat);
			this.server.to(data.roomId).emit('UpdateKey', gamestat);
		}
		catch (error)
		{
			throw new WsException('Internal Server Error')
		}
	}

	@SubscribeMessage('leaveChannel')
	leave(@ConnectedSocket() client: Socket, @MessageBody() name: string){
		const rooms = client.rooms;
		if (name){
			if (rooms.has(name))
				client.leave(name);
		}
	}

	@SubscribeMessage('privateMessage')
	async privateMessage(@ConnectedSocket() client : Socket, @MessageBody() target: string) {
		try {
			const privateMessage = await this.chatService.createPrivateMessage(client.data.userName, client.data.userId, target)
			this.server.to(client.id).emit('privateMessage')
			this.server.to(client.id).emit('activePrivateMessage', privateMessage)
			this.server.to(client.id).emit('updateChannelList')
			const clientIds = this.clients.get(target)
			if (clientIds)
			{
				clientIds.forEach (socketId =>
					this.server.to(socketId).emit('updateChannelList')
				)
			}
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError)
				throw new WsException(`Prisma error code : ${error.code}`)
			else if (error instanceof Error)
				throw new WsException(error.message)
			else
				throw new WsException('Internal server error')
		}
	}

	@SubscribeMessage('channelInvite')
	channelInvitation(@MessageBody() invite: InviteChannelDto) {
		const clientIds = this.clients.get(invite.name)
		if (clientIds)
		{
			clientIds.forEach (socketId =>
				this.server.to(socketId).emit('channelInvite', invite)
			)
		}
	}

	@SubscribeMessage('channelKick')
	async channelKick(@ConnectedSocket() client: Socket, @MessageBody() cmd: ChannelCmdDto) {
		try {
			const kickedUser = await this.chatService.kickUser(cmd)
			if (kickedUser) {
				const clientIds = this.clients.get(cmd.targetName)
				if (clientIds)
				{
					clientIds.forEach(socketId => {
						const clientTokick = this.server.sockets.sockets.get(socketId)
						if (clientTokick) {
							clientTokick.leave(cmd.channel)
							this.server.to(socketId).emit('kickedFromChannel', cmd.channel)
						}
						this.server.to(socketId).emit('kick', cmd.channel)
					})
				}
				this.server.to(cmd.channel).emit('updateChannelUsers')
			}
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError)
				throw new WsException(`Prisma error code : ${error.code}`)
			else if (error instanceof Error)
				throw new WsException(error.message)
			else
				throw new WsException('Internal server error')
		}
	}

	@SubscribeMessage('channelBan')
	async channelBan(@ConnectedSocket() client: Socket, @MessageBody() cmd: ChannelCmdDto) {
		try {
			const bannedUser = await this.chatService.banUser(cmd)
			if (bannedUser){
				const clientIds = this.clients.get(cmd.targetName)
				if (clientIds)
				{
					clientIds.forEach(socketId => {
						const clientTokick = this.server.sockets.sockets.get(socketId)
						if (clientTokick) {
							clientTokick.leave(cmd.channel)
							this.server.to(socketId).emit('kickedFromChannel', cmd.channel)
						}
						this.server.to(socketId).emit('ban', cmd.channel)
					})
				}
				this.server.to(cmd.channel).emit('updateChannelUsers')
			}
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError)
				throw new WsException(`Prisma error code : ${error.code}`)
			else if (error instanceof Error)
				throw new WsException(error.message)
			else
				throw new WsException('Internal server error')
		}
	}

	@SubscribeMessage('channelUnban')
	async channelUnban(@ConnectedSocket() client: Socket, @MessageBody() cmd: ChannelCmdDto) {
		try {
			const unbanUser = await this.chatService.unbanUser(cmd)
			if (unbanUser) {
				const clientIds = this.clients.get(cmd.targetName)
				if (clientIds)
				{
					clientIds.forEach(socketId => {
						this.server.to(socketId).emit('unban', cmd.channel)
					})
				}
			}
			this.server.to(cmd.channel).emit('updateChannelUsers')
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError)
				throw new WsException(`Prisma error code : ${error.code}`)
			else if (error instanceof Error)
				throw new WsException(error.message)
			else
				throw new WsException('Internal server error')
		}
	}

	@SubscribeMessage('channelSetAdmin')
	async channelSetAdmin(@MessageBody() cmd: ChannelCmdDto) {
		try {
			const admin = await this.chatService.setAdmin(cmd)
			if (admin) {
				const clientIds = this.clients.get(cmd.targetName)
				if (clientIds)
				{
					clientIds.forEach(socketId => {
						this.server.to(socketId).emit('setAdmin', cmd.channel)
					})
				}
			}
			this.server.to(cmd.channel).emit('updateChannelUsers')	
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError)
				throw new WsException(`Prisma error code : ${error.code}`)
			else if (error instanceof Error)
				throw new WsException(error.message)
			else
				throw new WsException('Internal server error')
		}
	}

	@SubscribeMessage('channelSetMember')
	async channelSetMember(@MessageBody() cmd: ChannelCmdDto) {
		try {
			const member = await this.chatService.setMember(cmd)
			if (member) {
				const clientIds = this.clients.get(cmd.targetName)
				if (clientIds)
				{
					clientIds.forEach(socketId => {
						this.server.to(socketId).emit('setMember', cmd.channel)
					})
				}
			}
			this.server.to(cmd.channel).emit('updateChannelUsers')	
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError)
				throw new WsException(`Prisma error code : ${error.code}`)
			else if (error instanceof Error)
				throw new WsException(error.message)
			else
				throw new WsException('Internal server error')
		}
	}

	async channelMute(@MessageBody() cmd: ChannelCmdDto) {
		try {
			const muted = await this.chatService.muteUser(cmd)
			if (muted) {
				const clientIds = this.clients.get(cmd.targetName)
				if (clientIds)
				{
					clientIds.forEach(socketId => {
						this.server.to(socketId).emit('muted', cmd.channel)
					})
				}
			}
			this.server.to(cmd.channel).emit('updateChannelUsers')
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError)
				throw new WsException(`Prisma error code : ${error.code}`)
			else if (error instanceof Error)
				throw new WsException(error.message)
			else
				throw new WsException('Internal server error')
		}
	}

	@SubscribeMessage('channelUnmute')
	async channelUnmute(@MessageBody() cmd: ChannelCmdDto) {
		try {
			const unmuted = await this.chatService.unmuteUser(cmd)
			if (unmuted) {
				const clientIds = this.clients.get(cmd.targetName)
				if (clientIds)
				{
					clientIds.forEach(socketId => {
						this.server.to(socketId).emit('unmuted', cmd.channel)
					})
				}
			}
			this.server.to(cmd.channel).emit('updateChannelUsers')	
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError)
				throw new WsException(`Prisma error code : ${error.code}`)
			else if (error instanceof Error)
				throw new WsException(error.message)
			else
				throw new WsException('Internal server error')
		}
	}

	@SubscribeMessage('quitChannel')
	async quitChannel(@MessageBody() cmd: quitCmdDto) {
		try {
			const deletedUser = await this.chatService.leaveChannel(cmd);
			if (deletedUser) {
				const clientIds = this.clients.get(cmd.user)
				if (clientIds)
				{
					clientIds.forEach(socketId => {
						const client = this.server.sockets.sockets.get(socketId)
						if (client) {
							client.leave(cmd.channel)
							this.server.to(socketId).emit('hideChat')
						}
						this.server.to(socketId).emit('updateChannelList')
					})
				}
			}
			if (cmd.alone){
				const deletedChannel = await this.chatService.deleteChannel(cmd.channel)
				return ;
			}
			if (cmd.newOwner)
			{
				const clientIds = this.clients.get(cmd.newOwner)
				if (clientIds)
				{
					clientIds.forEach(socketId => {
						this.server.to(socketId).emit('newOwner', cmd.channel)
					})
				}
			}
			this.server.to(cmd.channel).emit('updateChannelUsers')
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError)
				throw new WsException(`Prisma error code : ${error.code}`)
			else if (error instanceof Error)
				throw new WsException(error.message)
			else
				throw new WsException('Internal server error')
		}
	}
}
