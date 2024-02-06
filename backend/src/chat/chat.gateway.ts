
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
import { MessageDto } from './dto/message.dto';
import { WsExceptionFilter } from './filter/ws-exception.filter';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js';
import * as cookie from 'cookie';
import cookieParser from 'cookie-parser';

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

	constructor (private jwtService: JwtService,
		private prisma: PrismaService) {
			this.server = new Server();
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

	@SubscribeMessage('leaveChannel')
	leave(@ConnectedSocket() client: Socket, @MessageBody() name: string){
		const rooms = client.rooms;
		if (name){
			if (rooms.has(name))
				client.leave(name);
		}
	}

	@SubscribeMessage('privateMessage')
	privateMessage(@ConnectedSocket() client : Socket) {
		console.log(this.clients)
	}
}
