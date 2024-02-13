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

	// @Get(':pseudo')
	// async getOtherUserInfo(
	// 	@Req() req: Request,
	// 	@Param('pseudo') pseudo: string,
	// ) {
	// 	//To access userLogin and userID in req, see example below
	// 	const currentUser = req['userLogin'];
	// 	return this.userService.getOtherInfo(pseudo, currentUser);
	// }

	@Post('updateRanks')
	async updateRanks(
		@Body(new ParseArrayPipe({ items: LeaderboardDTO, whitelist: true }))
		dto: LeaderboardDTO[],
	) {
		return this.userService.updateRanks(dto);
	}
}
