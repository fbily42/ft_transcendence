import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";

@Catch(WsException)
export class WsExceptionFilter implements ExceptionFilter {
	catch(exception: WsException, host: ArgumentsHost) {
		const client = host.switchToWs().getClient();
		const errorMessage = exception.getError()

		console.log(errorMessage);
		client.emit('wsException', errorMessage);
	}
}