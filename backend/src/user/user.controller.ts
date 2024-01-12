import { UserService } from './user.service';
import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
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

	//TESTS du AuthGuard (supprimable)
	/*
	@Get()
	@UseGuards(AuthGuard)
	getUser(@Req() req: Request) { 
		return ({login: req['userLogin'], id: req['userID']});
	}
	*/

}
