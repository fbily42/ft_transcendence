
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
import { GameStats, RoomInfo } from './Game/Game.types';

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
	gamesRoom = new Map<string, RoomInfo[]>();
	gamesInfo = new Map<string , GameStats>();
	

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
				this.server.to(message.target).emit('messageToRoom');
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
			for (let [key, value] of this.gamesRoom)
			{
				// let stringcount = 0;
				// for (let item of value){
				// 	if (typeof item === 'string')
				// 		stringcount++;
				// 	if (stringcount === 2)
				// 		break;
				// }
				if (value.length < 2)
				{
					if (value[0].websocket != client.id && value[0].id != client.data.userId)
					{
						client.join(key);
						let array = this.gamesRoom.get(key);
						array.push({id:client.data.userId , websocket: client.id });
						this.gamesRoom.set(key, array);
						this.server.to(client.id).emit('JoinParty', `You have joined room : ${key}`)
						// console.log("nom de la room", key);
						this.server.to(key).emit('Ready', key);
						this.server.to(value[0].websocket).emit('JoinParty', 'Ready');
						return ;
	
					}
					else
						return;
				}
			}
			this.gamesRoom.set(room, [{id: client.data.userId, websocket: client.id}]);
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

			if (this.gamesInfo.has(room)){
				// console.log('la data existe');
				this.server.to(client.id).emit('UpdateKey', this.gamesInfo.get(room))
			}
			else{
				this.gamesInfo.set(room, new GameStats());
				this.server.to(client.id).emit('UpdateKey', this.gamesInfo.get(room))
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
			let gameStats:GameStats = this.gamesInfo.get(room);
			// if (now - gameStats.ball.last > delay)
			// {
				// gameStats.ball.last = now;
				gameStats.ball.x += gameStats.ball.dx * gameStats.ball.speed;
				gameStats.ball.y += gameStats.ball.dy * gameStats.ball.speed;
				
				gameStats.WallCollision();
			// }
			// gameStats.PaddleCollision(gameStats.paddleOne);
			// gameStats.PaddleCollision(gameStats.paddleTwo);
	
			this.gamesInfo.set(room, gameStats);
			this.server.to(room).emit('UpdateKey', gameStats);
		}
		catch(error)
		{
			console.log(error)
			// throw new WsException('Internal Server Error')
		}

	}
	@SubscribeMessage('endGame')
	endGame(@ConnectedSocket() client: Socket, @MessageBody() room:string)
	{
		try{
			let gameStats:GameStats = this.gamesInfo.get(room);
			let gamesRoom = this.gamesRoom;//il faut supprimer la room pour mettre a la personne de pouvoir relancer un matchmaking

			for (let [key , value ] of this.gamesRoom)
			{
				if (key === room)
				{
					if (gameStats.gameStatus.scoreOne === 10)
					{
						console.log("who win: 1")
						gameStats.gameStatus.winner = value[0].id
						gameStats.gameStatus.looser = value[1].id
						this.gamesInfo.set(room, gameStats);
						this.server.to(key).emit('UpdateKey', gameStats);
					}
					else 
					{
						console.log("who win : 2")
						gameStats.gameStatus.winner = value[1].id
						gameStats.gameStatus.gameState = value[0].id
						this.gamesInfo.set(room, gameStats);
						this.server.to(key).emit('UpdateKey', gameStats);
					}
					//mettre a jour la db avant de tout delete
					// this.gamesRoom.delete(room);
					// this.gamesInfo.delete(room);
				}	
			}
		} catch(error){
			console.log(error)
			// throw new WsException('Internal Server Error')

		}
	}


	@SubscribeMessage('leaveRoomBefore')
	leaveRoombefore(@ConnectedSocket() client: Socket, @MessageBody() room: string)
	{
		try {

			let gamestat:GameStats = this.gamesInfo.get(room);//il faut supprimer la roomm et le Gamestat
			let games_room = this.gamesRoom;//il faut supprimer la room pour mettre a la personne de pouvoir relancer un matchmaking
			let clients  = this.clients;//utilie les clientid dans games_room pour savoir qui a quitte la game avant la fin pour savoir si il y a quelqu'un a penalise
			
			// for (let [key , value ] of this.games_room)
			// {
			// 	if (key == room)
			// 	{
					
			// 	}
				
			// }
			this.gamesRoom.delete(room);
			this.gamesInfo.delete(room);
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
			//tout delete uniquement si la room est vide, donc verifier que
			let gameStats:GameStats = this.gamesInfo.get(room);//il faut supprimer la roomm et le Gamestat
			let gamesRoom = this.gamesRoom;//il faut supprimer la room pour mettre a la personne de pouvoir relancer un matchmaking
			let clients  = this.clients;//utilie les clientid dans gamesRoom pour savoir qui a quitte la game avant la fin pour savoir si il y a quelqu'un a penalise
			
				
			for (let [key , value ] of this.gamesRoom)
			{
				if (key === room)
				{
					if (client.id === value[0].websocket)
					{
						value.splice(0,1)
						gameStats.gameStatus.gameState = "Win";
						this.server.to(room).emit('UpdateKey', gameStats);
					}
					else if(client.id === value[1].websocket)
					{
						gameStats.gameStatus.gameState = "Win";
						this.server.to(room).emit('UpdateKey', gameStats);
						value.splice(1 , 1)
					}
					if (value.length === 0 )
					{
						this.gamesRoom.delete(room);
						this.gamesInfo.delete(room);
					}
				}	
			}

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
			if (this.gamesInfo.has(room))
			{
				let gameStats:GameStats = this.gamesInfo.get(room);
				
				if (gameStats !== undefined && gameStats.PaddleCollision !== undefined)
				{
					gameStats.PaddleCollision(gameStats.paddleOne);
					gameStats.PaddleCollision(gameStats.paddleTwo);
					
				}
				this.gamesInfo.set(room, gameStats);
				this.server.to(room).emit('UpdateKey', gameStats);
			}
		}
		catch(error)
		{
			console.log(error)
			// throw new WsException('Internal Server Error')
		}
		

	}
	
	@SubscribeMessage('key')
	UpdateKey(@ConnectedSocket() client: Socket, @MessageBody() data: { key: string; roomId: string })
	{
		try {

			let gameStats:GameStats = this.gamesInfo.get(data.roomId)
			let array = this.gamesRoom.get(data.roomId);
			// if(array[0] == client.id)
			// {
	
				if (data.key === "a") {
					if ((gameStats.paddleOne.y - 10) > 0 )
						gameStats.paddleOne.y -= 5;
					}
	
				else if (data.key === "d") {
					if ((gameStats.paddleOne.y + 10 + 60) < gameStats.canvas.height )
					{
						gameStats.paddleOne.y += 5;
					}
				}
				// else
				// 	return;
	
			// }
			// if(array[1] == client.id)
			// {
				if (data.key === "ArrowUp" ) {
					if ((gameStats.paddleTwo.y - 10) > 0 )
						gameStats.paddleTwo.y -= 5;
					}
		
				else if (data.key === "ArrowDown") {
					if ((gameStats.paddleTwo.y + 10 + 60) < gameStats.canvas.height )
					{
						gameStats.paddleTwo.y += 5;
					}
				}
				// else
				// return;
	
			// }
	
			this.gamesInfo.set(data.roomId, gameStats);
			this.server.to(data.roomId).emit('UpdateKey', gameStats);
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
			throw new WsException('Internal server error')
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

	@SubscribeMessage('channelMute')
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
}
