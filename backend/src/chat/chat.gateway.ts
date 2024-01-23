
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
import { NewChannelDto } from './dto';
import { Channel } from '@prisma/client';
import { UsePipes, ValidationPipe } from '@nestjs/common';

@UsePipes(new ValidationPipe())
@WebSocketGateway(8081, {
	cors: {
		origin: "http://localhost:3000",
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
				client.disconnect();
			const jwt = cookie.split('=');
			const decode = this.jwtService.verify(jwt[1]);
			client.data = { userId: decode.sub, userName: decode.login };
		} catch (error) {
			console.log(error);
			client.disconnect();
			throw new WsException('Bad credentials');
		}
	}

	@SubscribeMessage('message')
	handleMessage(@ConnectedSocket() client: Socket, @MessageBody() message: string): void {
		this.server.emit('message', message);
	}

	@SubscribeMessage('createChannel')
	async create(@ConnectedSocket() client: Socket, @MessageBody() dto: NewChannelDto){
		console.log(dto);
		const channel: Channel =  await this.chatService.createChannel(client.data.userId, dto);
		console.log(channel)
		this.server.emit('Channel created', {name: channel.name, id: channel.id})
	}

	@SubscribeMessage('joinChannel')
	join(@ConnectedSocket() client: Socket, @MessageBody() name: string){
		client.join(name);
		this.server.to(name).emit('message', `${client.data.userName} joined channel`);
	}

}
