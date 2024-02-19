
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
