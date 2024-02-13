
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

	@SubscribeMessage('joinRoom')
	joingame(@ConnectedSocket() client: Socket, @MessageBody() name: string)
	{
		for (let [key, value] of this.games_room)
		{
			let stringcount = 0;
			for (let item of value){
				if (typeof item === 'string')
				{
					stringcount++;
				}
				if (stringcount === 2){
					break;
				}
			}
			if (stringcount < 2)
			{
				client.join(key);
				client.emit('JoinParty', `You have joined room : ${key}` )
			}
		}
		client.join(name);
		client.emit('JoinParty', `You have created a room : ${name}`);
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
		let channelName: string;
			if (client.data.userName.toLowerCase() < target.toLowerCase())
				channelName = `${client.data.userName}_${target}`
			else
				channelName = `${target}_${client.data.userName}`
		console.log(channelName)
		try {
			const channel = await this.prisma.channel.findUnique({
				where:{
					name: channelName
				}
			})
			if (!channel){
				const channel = await this.prisma.channel.create({
					data: {
						name: channelName,
						direct: true,
						private: true,
					}
				})
				const user = await this.prisma.user.findUnique({
					where:{
						name: target,
					}
				})
				if (!user)
					throw new Error('Private message target does not exists');
				await this.prisma.channelUser.createMany({
					data: [
						{channelId: channel.id, userId: client.data.userId},
						{channelId: channel.id, userId: user.id},
					],
				})
			}
			console.log(channel.name)
			this.server.to(client.id).emit('privateMessage', channel.name)
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