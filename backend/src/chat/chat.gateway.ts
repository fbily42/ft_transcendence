
import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway()
export class ChatGateway {
	@WebSocketServer()
	server: Server;

	@SubscribeMessage('message')
	handleMessage(@MessageBody() message: string): void {
		this.server.emit('message', message);
	}
}
