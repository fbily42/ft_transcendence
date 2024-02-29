import { Body, Controller, Get, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

import { Message } from '@prisma/client';
import { GameService } from './game.service';


@Controller('game')
export class GameController {
	constructor(private gameService: GameService) {}

	@Get('invitGame')
	async invitation(@Req() req: Request, @Res() res: Response)
	{

	}

}
