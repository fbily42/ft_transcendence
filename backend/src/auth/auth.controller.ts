import { Controller, Get, Req, Res, UseGuards, HttpCode, Delete, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';
import { HttpException, HttpStatus } from '@nestjs/common';

@Controller ('auth')
export class AuthController{
	constructor(private authService: AuthService) {}

	
	
	@Get('42')
	async login(@Req() req : Request, @Res() res : Response) {
		
		try {
			const code = req.query?.code as string ;

			if (!code || req.query?.error) {
				throw new HttpException('Access denied', HttpStatus.UNAUTHORIZED);
			}
			
			// Get the token access from 42api
			const token = await this.authService.getToken(code);
			
			// Get the login of the user from 42api
			const login :string = await this.authService.getUserLogin(token);
			
			// Find if User exists, create if doesnt
			const user = await this.authService.findUser(login, token);
			
			// Create JWT and add to the user in DB
			const jwt = await this.authService.createJwt(user);
			
			// Create cookie for browser
			res.cookie('jwt', jwt, {
				httpOnly: true,
				sameSite: 'strict',
				secure: true,
				domain: process.env.FRONTEND_DOMAIN,
			});
			res.redirect("http://localhost:3000/");
			
		} catch(error) {
			res.redirect("http://localhost:3000/auth");
			throw error;
		}
	}
	
	@Get('isAuth')
	@UseGuards(AuthGuard)
	@HttpCode(200)
	isAuthentified(){
	}

	@Get('logout')
	async logout(@Req() req : Request, @Res() res : Response): Promise<void> {

		try {

			const jwt = req.cookies['jwt'] as string;
			//supprimer le cookie
			console.log('valeur', jwt);
			
			//gerer la mise a jour de mon token
			await this.authService.deleteTokens(jwt);
			res.clearCookie('jwt', {path: '/' });
			res.status(200).send('Déconnexion réussie');

		} catch (error) {
			console.log('issu in logout ');
			// throw error;
		}
	}
}
/* 

To find Cookie in Chrome :

	Inspect (F12) -> Appplication -> Cookies

*/