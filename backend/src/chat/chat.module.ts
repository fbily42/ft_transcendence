import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from '../app.gateway';

@Module({
	controllers: [ChatController],
	providers: [ChatService, ChatGateway],
})
export class ChatModule {}
