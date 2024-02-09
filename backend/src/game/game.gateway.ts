import { JwtService } from "@nestjs/jwt";
import { OnGatewayConnection, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import * as cookie from 'cookie';
import { ChatService } from "src/chat/chat.service";
@WebSocketGateway(8081, {
	cors: {
		origin: `${process.env.FRONTEND_URL}`,
		credentials: true,
	},
	transports: ['websocket', 'polling'],
})

export class GameGateway {
	constructor (private chatService: ChatService){}

	// async handleConnection(client: any, ...args: any[]) {
	// 	try {

	// 		const cookiestr = client.handshake.headers.cookie;
	// 		if (!cookiestr)
	// 		{
	// 			client.disconnect();
	// 			return;
	// 		}
	// 		const parsedcookie = cookie.parse(cookiestr);
	// 		const jwt = parsedcookie['jwt'];
	
	// 		const decode = this.jwtService.verify(jwt);
	// 		console.log('bonjour')
      
	// 		client.data = { userId: decode.sub, userName: decode.login };
	// 	} catch (error) {
	// 		client.disconnect();
		
	// 	}
	// }

	@SubscribeMessage('game invitation')
	handleGameInvitation(client :any, data: {to: string, game: any}): void {
		console.log(`Game invitation received. To: ${data.to}, Game: ${data.game}`);
		const toSocketId = this.chatService.map.get(data.to);

		if (!toSocketId){
			console.log("erreur pas dans la map");
			return ;
		}

		client.to(toSocketId).emit('game invitation', {from: client.id, game: data.game});


	}

  }