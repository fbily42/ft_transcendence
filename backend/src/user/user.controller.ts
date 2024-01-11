import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@Get('me')
	async getUserInfo(@Req() req: Request) {

		const token = req.headers.authorization;
		const jwt = token.split(' ')
		
		return  await this.userService.getInfo(jwt[1]);
	}

}
