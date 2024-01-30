
import { JwtService } from '@nestjs/jwt';
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from './chat.service';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessageDto } from './dto/message.dto';
import { WsExceptionFilter } from './filter/ws-exception.filter';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js';

@UsePipes(new ValidationPipe())
@UseFilters(new WsExceptionFilter())
@WebSocketGateway(8081, {
	cors: {
		origin: `${process.env.FRONTEND_URL}`,
		credentials: true,
	},
	transports: ['websocket', 'polling'],
	})
export class ChatGateway implements OnGatewayConnection {
	
	@WebSocketServer()
	server: Server;

	constructor (private jwtService: JwtService,
		private prisma: PrismaService,
		private chatService: ChatService) {
			this.server = new Server();
		}

	async handleConnection(client: Socket) {
		
		try {
			const cookie = client.handshake.headers.cookie;
			if (!cookie)
				throw new Error('JWT is missing')
			const jwt = cookie.split('=');
			const decode = this.jwtService.verify(jwt[1]);
			client.data = { userId: decode.sub, userName: decode.login };
		} catch (error) {
			client.emit('exception', error.message);
			client.disconnect();
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
			console.log(messages)
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

}
