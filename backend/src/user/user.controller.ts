import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	//TESTS du AuthGuard (supprimable)
	/*
	@Get()
	@UseGuards(AuthGuard)
	getUser(@Req() req: Request) { 
		return ({login: req['userLogin'], id: req['userID']});
	}
	*/
}
