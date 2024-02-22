import { Module } from '@nestjs/common';


import { ChatGateway } from '../app.gateway';
import { GameService } from './game.service';

@Module({
	controllers: [GameModule],
	providers: [GameService, ChatGateway],
})
export class GameModule {}