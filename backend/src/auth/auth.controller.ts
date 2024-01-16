import { Controller, Get, Req, Res, UseGuards, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';

@Controller ('auth')
export class AuthController{
	constructor(private authService: AuthService) {}

	@Get('42')
	async login(@Req() req : Request, @Res() res : Response) {

		const code = req.query.code as string;
		
		// Get the token access from 42api
		const token = await this.authService.getToken(code);
		
		// Get the login of the user from 42api
		const login :string = await this.authService.getUserLogin(token);
		
		// Find if User exists, create if doesnt
		const user = await this.authService.findUser(login, token);
		
		// Create JWT and add to the user in DB
		const jwt = await this.authService.createJwt(user);

		// Create cookie for browser
		// res.cookie('jwt', jwt);
		res.cookie('jwt', jwt, {
			httpOnly: true,
			sameSite: 'strict',
			secure: true,
			domain: process.env.FRONTEND_DOMAIN,
		});
		// res.cookie('jwt', jwt);

		// Redirect to Dashboard
		res.redirect("http://localhost:3000/");
	}

	@Get('isAuth')
	@UseGuards(AuthGuard)
	@HttpCode(200)
	isAuthentified(){
	}
}
/* 

To find Cookie in Chrome :

	Inspect (F12) -> Appplication -> Cookies

*/