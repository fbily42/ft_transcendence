import { Controller, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Controller ('auth')
export class AuthController{
	constructor(private authService: AuthService) {}

	@Get('42')
	async login(@Req() req : Request) {

		const code = req.query.code as string;
		
		const token = await this.authService.getToken(code);
		
		const login :string = await this.authService.getUserLogin(token);
		
		const user = await this.authService.findUser(login, token);
		
		//CreateJWT

		//RedirectToDashboard

		return user;
	}
}