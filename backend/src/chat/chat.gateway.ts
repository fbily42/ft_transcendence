
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

			const cookiestr = client.handshake.headers.cookie;
			if (!cookiestr)
			{
				client.disconnect();
				return;
			}
			const parsedcookie = cookie.parse(cookiestr);
			const jwt = parsedcookie['jwt'];
	
			const decode = this.jwtService.verify(jwt);
			console.log('Hello');

			//pour l'instant pour une question de facilite je vais utiliser le login dans map mais il faudrait utiliser le decode.sub
			this.chatService.map.set(decode.login, client.id);
      
			client.data = { userId: decode.sub, userName: decode.login };
		} catch (error) {
			client.disconnect();
// 			throw new WsException('Bad credentials');
		}
	}

	@SubscribeMessage('message')
	handleMessage(@ConnectedSocket() client: Socket, @MessageBody() message: string): void {
		this.server.emit('message', message);
	}

	@SubscribeMessage('joinChannel')
	join(@ConnectedSocket() client: Socket, @MessageBody() name: string){
		client.join(name);
		this.server.to(name).emit('message', `${client.data.userName} joined channel ${name}`);
	}

}
