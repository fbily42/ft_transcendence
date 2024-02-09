import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { ChatService } from 'src/chat/chat.service';


@Module({
	controllers: [GameController],
	providers: [GameService, ChatService],
})
export class GameModule {}