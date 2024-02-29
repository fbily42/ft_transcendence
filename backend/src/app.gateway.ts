
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



	@SubscribeMessage('AcceptInvitation')
	acceptInvitation(@ConnectedSocket() client: Socket, @MessageBody() data: { friend: string; roomId: string })
	{
		try {

			if (this.gamesRoom.has(data.roomId))
			{
				client.join(data.roomId);
				let array = this.gamesRoom.get(data.roomId);
				array.push({id:client.data.userName , websocket: client.id, matchmaking: false});
				this.gamesRoom.set(data.roomId, array);
				this.server.to(client.id).emit('ReadyForGame', 'Joined')//creer le .on 

				this.server.to(this.gamesRoom.get(data.roomId)[0].websocket).emit('JoinPartyFriend', 'Go');


				// this.server.to(this.gamesRoom[data.roomId][0].websocket).emit('JoinPartyFriend', 'Go');//pour le createur

				this.server.to(data.roomId).emit('Ready', data.roomId);

				return ;
			}
			else
				return;

		}
		catch(error){
			throw new WsException('Internal Server Error');

		}

	}
	@SubscribeMessage('DeclineInvitation')
	declineInvitation(@ConnectedSocket() client: Socket, @MessageBody() data: { friend: string; roomId: string })
	{
		try {
			if (this.gamesRoom.has(data.roomId))
			{
				//envoyer un emit qui va faire quitter la partie au createur et qui va le prevenir que le joueur a refuser de joueur avec lui
				this.server.to(this.gamesRoom.get(data.roomId)[0].websocket).emit('JoinPartyFriend', "Decline")
				return ;
			}

		}
		catch(error){
			throw new WsException('Internal Server Error');

		}

	}

	//est ce que je dois stocker le nom de la personne qui est invite pour ajouter une securite ou est ce que le fait qu'il soit le seul a recevoir une Key unique est suffisant
	@SubscribeMessage('JoinRoomFriend')
	joinGameRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { friend: string; roomId: string })
	{
		try {

			if(this.clients.has(data.friend))//verifier d'abord que l'amis est connecte, faire une deuxieme verification avant d'envoyer l'invitation
			{
				this.gamesRoom.set(data.roomId, [{id: client.data.userName, websocket: client.id, matchmaking:false}]);
				client.join(data.roomId);
				const clientIds = this.clients.get(data.friend)
				if (clientIds)
				{
					clientIds.forEach ((socketId) => {

						this.server.to(socketId).emit('GameInvitation', {friend: data.friend, roomId: data.roomId})
					}
					)
				}
				// this.server.to(this.clients[data.friend]).emit('GameInvitation', {friend: data.friend, roomId: data.roomId})
				// this.server.to(client.id).emit('JoinParty', `You have created a room : ${data.roomId}`);
				return ;
			}
			else
			{
				this.server.to(client.id).emit('JoinPartyFriend', 'Error');
				return;
			}

		}
		catch(error){
			throw new WsException('Internal Server Error');

		}

	}
	


	//possible probleme
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
				if (value.length == 1)
				{
					if (value[0].websocket != client.id && value[0].id != client.data.userName && value[0].matchmaking === true)
					{
						client.join(key);
						let array = this.gamesRoom.get(key);
						array.push({id:client.data.userName , websocket: client.id, matchmaking: true});
						this.gamesRoom.set(key, array);
						this.server.to(client.id).emit('JoinParty', 'Joined')
						this.server.to(value[0].websocket).emit('JoinParty', 'Go');

						this.server.to(key).emit('Ready', key);
						return ;
	
					}
				}
			}
			this.gamesRoom.set(room, [{id: client.data.userName, websocket: client.id, matchmaking:true}]);
			client.join(room);

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

				
				this.server.to(client.id).emit('UpdateKey', this.gamesInfo.get(room))
			}
			else {
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
			
			if(this.gamesInfo.has(room))
			{

				// const now = Date.now();
				// const delay = 10;
				let gameStats:GameStats = this.gamesInfo.get(room);
				// if (now - gameStats.ball.last > delay)
				// {
					// gameStats.ball.last = now;
					gameStats.ball.x += gameStats.ball.dx * gameStats.ball.speed;
					gameStats.ball.y += gameStats.ball.dy * gameStats.ball.speed;
					
					gameStats.WallCollision();
					if (gameStats.gameStatus.gameState == 'finish'){

						let gamesRoom = this.gamesRoom.get(room)
						// this.server.to(room).emit('finish', gameStats);
						if (gameStats.gameStatus.scoreOne == 10)
						{

							gameStats.gameStatus.winner = gamesRoom[1].id;
							gameStats.gameStatus.looser = gamesRoom[0].id;
						}
						else if(gameStats.gameStatus.scoreTwo == 10)
						{

							gameStats.gameStatus.winner = gamesRoom[0].id;
							gameStats.gameStatus.looser = gamesRoom[1].id;
						}
						this.server.to(room).emit('finish', gameStats);
						//mettre a jour DB
						// clear rooms info
						this.gamesRoom.delete(room);
						this.gamesInfo.delete(room);
						return;
					}
				// }
				// gameStats.PaddleCollision(gameStats.paddleOne);
				// gameStats.PaddleCollision(gameStats.paddleTwo);
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

			throw new WsException('Internal Server Error')
		}

	}
	@SubscribeMessage('endGame')
	endGame(@ConnectedSocket() client: Socket, @MessageBody() room:string)
	{
		try{
			if (this.gamesInfo.has(room))
			{

				let gameStats:GameStats = this.gamesInfo.get(room);
				let gamesRoom = this.gamesRoom;//il faut supprimer la room pour mettre a la personne de pouvoir relancer un matchmaking
	
				for (let [key , value ] of this.gamesRoom)
				{
					if (key === room)
					{
						if (gameStats.gameStatus.scoreOne === 10)
						{

							gameStats.gameStatus.winner = value[1].id
							gameStats.gameStatus.looser = value[0].id
							this.gamesInfo.set(room, gameStats);
							this.server.to(key).emit('UpdateKey', gameStats);
						}
						else if (gameStats.gameStatus.scoreTwo === 10)
						{
							gameStats.gameStatus.winner = value[0].id

							gameStats.gameStatus.looser = value[1].id

							this.gamesInfo.set(room, gameStats);
							this.server.to(key).emit('UpdateKey', gameStats);
						}
						//mettre a jour la db avant de tout delete
						// this.gamesRoom.delete(room);
						// this.gamesInfo.delete(room);
					}	
				}
			}
		} catch(error){
			// console.log(error)
			throw new WsException('Internal Server Error')

		}
	}


	@SubscribeMessage('leaveRoomBefore')
	leaveRoombefore(@ConnectedSocket() client: Socket, @MessageBody() room: string)
	{
		try {

			let gamestat:GameStats = this.gamesInfo.get(room);//il faut supprimer la roomm et le Gamestat
			let games_room = this.gamesRoom;//il faut supprimer la room pour mettre a la personne de pouvoir relancer un matchmaking
			let clients  = this.clients;//utilie les clientid dans games_room pour savoir qui a quitte la game avant la fin pour savoir si il y a quelqu'un a penalise
	
	
			if (this.gamesRoom.has(room)) {
				this.gamesRoom.delete(room);

			}
			else
				return
			
			if (this.gamesInfo.has(room)) {
				this.gamesInfo.delete(room);
			}
			else
				return
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
			let gamesRoom = this.gamesRoom.get(room)//il faut supprimer la room pour mettre a la personne de pouvoir relancer un matchmaking
			let clients  = this.clients;//utilie les clientid dans gamesRoom pour savoir qui a quitte la game avant la fin pour savoir si il y a quelqu'un a penalise

			if (gameStats?.gameStatus?.gameState === 'finish') return;
			if(!gamesRoom) return 
			if (gamesRoom[0].websocket === client.id){
				gameStats.gameStatus.gameState = "finish";
				gameStats.gameStatus.winner = gamesRoom[1].id;
				gameStats.gameStatus.looser = gamesRoom[0].id;
				gameStats.gameStatus.scoreOne = 0;
				gameStats.gameStatus.scoreTwo = 10;
				this.server.to(room).emit('finish', gameStats);
				// Ajouter dans la db
				this.gamesRoom.delete(room);
				this.gamesInfo.delete(room);
				return;
			}
			if (gamesRoom[1].websocket === client.id){
				gameStats.gameStatus.gameState = "finish";
				gameStats.gameStatus.winner = gamesRoom[0].id;
				gameStats.gameStatus.looser = gamesRoom[1].id;
				gameStats.gameStatus.scoreOne = 10;
				gameStats.gameStatus.scoreTwo = 0;
				this.server.to(room).emit('finish', gameStats);
				// Ajouter dans la db
				this.gamesRoom.delete(room);
				this.gamesInfo.delete(room);
				return;
			}


		}
		catch(error)
		{
			console.log(error);
			// throw new WsException('Internal Server Error')
		}

	}

	// @SubscribeMessage('paddllColl')
	// paddllColl(@ConnectedSocket() client: Socket, @MessageBody() room: string)
	// {
	// 	try {
	// 		if (this.gamesInfo.has(room))
	// 		{
	// 			let gameStats:GameStats = this.gamesInfo.get(room);
				
	// 			if (gameStats !== undefined && gameStats.PaddleCollision !== undefined)
	// 			{
	// 				gameStats.PaddleCollision(gameStats.paddleOne);
	// 				gameStats.PaddleCollision(gameStats.paddleTwo);
					
	// 			}
	// 			this.gamesInfo.set(room, gameStats);
	// 			this.server.to(room).emit('UpdateKey', gameStats);
	// 		}
	// 	}
	// 	catch(error)
	// 	{

	// 		throw new WsException('Internal Server Error')
	// 	}
		

	// }
	
	@SubscribeMessage('key')
	UpdateKey(@ConnectedSocket() client: Socket, @MessageBody() data: { key: string; roomId: string })
	{
		try {
			if (this.gamesInfo.has(data.roomId) && this.gamesRoom.has(data.roomId))
			{

				let gameStats:GameStats = this.gamesInfo.get(data.roomId)
				let array = this.gamesRoom.get(data.roomId);
				if(array[0].websocket == client.id)
				{
		
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
					else
						return;
		
				}
				if(array[1].websocket == client.id)
				{
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
					else
						return;
		
				}
		
				this.gamesInfo.set(data.roomId, gameStats);
				this.server.to(data.roomId).emit('UpdateKey', gameStats);
			}
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
