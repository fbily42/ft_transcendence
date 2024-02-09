import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { ChatService } from 'src/chat/chat.service';


@Module({
	controllers: [GameController],
	providers: [GameService, GameGateway, ChatService],
})
export class GameModule {}