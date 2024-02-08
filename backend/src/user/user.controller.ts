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

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
	constructor(private userService: UserService) {}

	@Get('me')
	async getUserInfo(@Req() req: Request) {
		//To access userLogin and userID in req, see example below
		const jwt = req.cookies.jwt;
		return await this.userService.getInfo(jwt);
	}

	@Get(':pseudo')
	async getOtherUserInfo(@Req() req: Request, @Param('pseudo') pseudo: String) {
		//To access userLogin and userID in req, see example below
		const currentUser = req['userLogin'];
		return this.userService.getOtherInfo(pseudo, currentUser);
	}

	@Get('leaderboard')
	async getLeaderboard() {
		return this.userService.getLeaderboard();
	}

	@Post('updateRanks')
	async updateRanks(
		@Body(new ParseArrayPipe({ items: LeaderboardDTO, whitelist: true }))
		dto: LeaderboardDTO[],
	) {
		return this.userService.updateRanks(dto);
	}
}
