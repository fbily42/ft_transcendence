import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";

//Works only on methods with @SubscribeMessage decorator
@Catch(WsException)
export class WsExceptionFilter implements ExceptionFilter {
	catch(exception: WsException, host: ArgumentsHost) {
		const client = host.switchToWs().getClient();
		const errorMessage = exception.getError()

		client.emit('exception', errorMessage);
	}
}