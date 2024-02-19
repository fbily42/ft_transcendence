import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";

//Works only on methods with @SubscribeMessage decorator
@Catch(WsException, BadRequestException)
export class WsExceptionFilter implements ExceptionFilter {
	catch(exception: WsException | BadRequestException, host: ArgumentsHost) {
		const client = host.switchToWs().getClient();
		const errorMessage = exception.message;

		// console.log(`WebSocket exception : ${errorMessage}`) -> for prod version
		console.log(exception)
		// client.emit('exception', errorMessage);
	}
}