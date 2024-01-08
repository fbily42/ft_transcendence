import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@Post('create')
	createUser(@Body() dto: UserDto) {
		return this.userService.createUser(dto);
	}
}
