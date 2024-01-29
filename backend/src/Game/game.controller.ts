import { Controller, Get, Param, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { GameService } from "./game.service";
import { Request, Response } from 'express';

@Controller('game')
@UseGuards(AuthGuard)

export class GameController{
	constructor(private GameService: GameService){}

	@Get('invitGame/:name')
	async getInviteLogin(@Param ('name') name: string ,@Req() req: Request, @Res() res: Response){
		try {
			await this.GameService.confirmLogin(name);
			res.status(200).send('Login found');
			
		} catch (error)
		{
			res.status(404).send('Not found');
		}
	}
}

