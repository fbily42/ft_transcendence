import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from '../app.gateway';
import { UserService } from 'src/user/user.service';

@Module({
	controllers: [ChatController],
	providers: [ChatService, ChatGateway, UserService],
})
export class ChatModule {}
