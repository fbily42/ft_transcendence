
import {
	MessageBody,
	OnGatewayConnection,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(8081, {cors: 'http://localhost'})
export class ChatGateway implements OnGatewayConnection {
	@WebSocketServer()
	server: Server;

	handleConnection(client: Socket) {
		const jwt = client.handshake.headers.cookie;
		console.log(jwt);
	}

	@SubscribeMessage('message')
	handleMessage(@MessageBody() message: string): void {
		this.server.emit('message', message);
	}
}
