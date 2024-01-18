import { UserService } from './user.service';
import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('user')
@UseGuards(AuthGuard)

export class UserController {
	constructor(private userService: UserService) {}

	@Get('me')
	async getUserInfo(@Req() req: Request) {
		//To access userLogin and userID in req, see example below
		const jwt = req.cookies.jwt
		return  await this.userService.getInfo(jwt);
	}

	@Get('leaderboard')
	@UseGuards(AuthGuard)
	async getLeaderboard() {
		return this.userService.getLeaderboard();
	}

	// TODO: DTO pour la data pour etre sure de ce qu'on envoi
	@Post('updateRanks')
	@UseGuards(AuthGuard)
	async updateRanks(@Body() data: any) {
		return this.userService.updateRanks(data);
	}
}
