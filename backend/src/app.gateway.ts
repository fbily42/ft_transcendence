
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
import { MessageDto } from './chat/dto/message.dto';
import { WsExceptionFilter } from './chat/filter/ws-exception.filter';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js';
import * as cookie from 'cookie';
import { InviteChannelDto } from './chat/dto/inviteChannel.dto';
import { GameStat } from './Game/Game.types';

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
		private prisma: PrismaService) {
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
			const messages = await this.prisma.message.create({
				data: {
					channelName: message.target,
					content: message.message,
					sentByName: message.userName,
				}
			})
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError)
				throw new WsException(`Prisma error code : ${error.code}`);
			throw new WsException('Internal Server Error');
		}
		this.server.to(message.target).emit('messageToRoom', 'newMessage');
	}

	@SubscribeMessage('joinChannel')
	join(@ConnectedSocket() client: Socket, @MessageBody() name: string){
		const rooms = client.rooms;
		if (name){
			if (rooms.has(name))
				return ;
			client.join(name);
			this.server.to(name).emit('update', client.data.userName)
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
					this.server.emit('JoinParty', `You have joined room : ${key}`)
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
		this.server.emit('JoinParty', `You have created a room : ${room}`);
		return ;
	}

	@SubscribeMessage('CreateGameinfo')
	CreateGameinfo(@ConnectedSocket() client: Socket, @MessageBody() room:string)
	{
		if (this.games_info.has(room)){
			// console.log('la data existe');
			this.server.to(client.id).emit('UpdateKey', this.games_info.get(room))
		}
		else{
			this.games_info.set(room, new GameStat());
			this.server.to(client.id).emit('UpdateKey', this.games_info.get(room))
		}
	}

	@SubscribeMessage('ballMov')
	ballMov(@ConnectedSocket() client: Socket, @MessageBody() room: string)
	{
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

	//faire le cas ou une personne quitte
	//le cas ou c'est la fin de la partie 
	@SubscribeMessage('leaveRoom')
	leaveRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string)
	{
		let gamestat:GameStat = this.games_info.get(room);//il faut supprimer la roomm et le Gamestat
		let games_room = this.games_room;//il faut supprimer la room pour mettre a la personne de pouvoir relancer un matchmaking
		let clients  = this.clients;//utilie les clientid dans games_room pour savoir qui a quitte la game avant la fin pour savoir si il y a quelqu'un a penalise
		gamestat
		for (let [key , value ] of this.games_room)
		{

		}

	}

	@SubscribeMessage('paddllColl')
	paddllColl(@ConnectedSocket() client: Socket, @MessageBody() room: string)
	{
		let gamestat:GameStat = this.games_info.get(room);
		gamestat.PaddleCollision(gamestat.paddle_1);
		gamestat.PaddleCollision(gamestat.paddle_2);
		this.games_info.set(room, gamestat);
		this.server.to(room).emit('UpdateKey', gamestat);
		

	}
	
	@SubscribeMessage('key')
	UpdateKey(@ConnectedSocket() client: Socket, @MessageBody() data: { key: string; roomId: string })
	{
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

		// }

		this.games_info.set(data.roomId, gamestat);
		this.server.to(data.roomId).emit('UpdateKey', gamestat);

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
	privateMessage(@ConnectedSocket() client : Socket, @MessageBody() target: string) {
		
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
	channelKick(@ConnectedSocket() client: Socket) {}
}

/* @SubscribeMessage('game invitation')
	handleGameInvitation(client :any, data: {to: string, game: any}): void {
		console.log(`Game invitation received. To: ${data.to}, Game: ${data.game}`);
		const toSocketId = this.chatService.map.get(data.to);

		if (!toSocketId){
			console.log("erreur pas dans la map");
			return ;
		}

		client.to(toSocketId).emit('game invitation', {from: client.id, game: data.game});


	} */