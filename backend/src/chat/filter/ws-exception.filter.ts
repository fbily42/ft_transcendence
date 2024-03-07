import {
	ArgumentsHost,
	BadRequestException,
	Catch,
	ExceptionFilter,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Catch(WsException, BadRequestException)
export class WsExceptionFilter implements ExceptionFilter {
	catch(exception: WsException | BadRequestException, host: ArgumentsHost) {
		const client = host.switchToWs().getClient();
		const errorMessage = exception.message;

		client.emit('exception', { errorMessage });
	}
}
