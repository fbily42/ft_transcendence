import { UserService } from './user.service';
import {
	Body,
	Controller,
	Post,
	Get,
	UseGuards,
	Req,
	ParseArrayPipe,
	Param,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { LeaderboardDTO } from './dto/leaderboard.dto';
import { User } from 'src/decorators/user.decorators';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
	constructor(private userService: UserService) {}

	@Get('me')
	async getUserInfo(@User() user) {
		//To access userLogin and userID in req, see example below
		return this.userService.getInfo(user.name);
	}

	@Get('all')
	async getUsers() {
		//To access userLogin and userID in req, see example below
		return this.userService.getUsers();
	}

	@Get('leaderboard')
	async getLeaderboard() {
		return this.userService.getLeaderboard();
	}

	@Get('/profile/:id')
	async getUserById(@Param('id') id: string) {
		return this.userService.getUserById(id);
	}

	@Post('updateRanks')
	async updateRanks(
		@Body(new ParseArrayPipe({ items: LeaderboardDTO, whitelist: true }))
		dto: LeaderboardDTO[],
	) {
		return this.userService.updateRanks(dto);
	}

	@Get('gameHistory/me')
	async myGameHistory(@User() user) {
		return this.userService.GameHistory(user.id);
	}

	@Get('gameHistory/:userId')
	async GameHistory(@Param('userId') userId: string) {
		return this.userService.GameHistory(userId)
	}
}
