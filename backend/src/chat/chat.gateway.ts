
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
	handleMessage(@ConnectedSocket() client: Socket, @MessageBody() message: MessageDto){
		console.log(message)
		this.server.to(message.target).emit('messageToRoom', message);
	}

	@SubscribeMessage('joinChannel')
	join(@ConnectedSocket() client: Socket, @MessageBody() name: string){
		// Check if client is already in the room before join
		client.join(name);
		console.log(client.rooms)
		console.log(`${client.data.userName} joined channel ${name}`)
	}

	@SubscribeMessage('leaveChannel')
	leave(@ConnectedSocket() client: Socket, @MessageBody() name: string){
		// Check if client is in the room before leave
		client.leave(name);
		console.log(`${client.data.userName} leaved channel ${name}`)
	}

}
