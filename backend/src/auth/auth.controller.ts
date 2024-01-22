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
				sameSite: 'strict',
				httpOnly : true,
				secure : true,
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

	@Get('refresh-token')//faire un appelle a refresh token si le guard renvoie faux
	async refreshToken(@Req() req : Request, @Res() res : Response)
	{

		try{
			console.log('JE SUIS LE GET DE REFRESHTOKEN');
			const jwt = req.cookies['jwt'] as string;
			//supprimer le cookie
			const jwtsign: string = await this.authService.refreshTheToken(jwt);
			// res.clearCookie('jwt', {
			// 	path: '/',
			// 	sameSite: 'strict',
			// 	httpOnly : true,
			// 	secure : true,
			// 	domain: process.env.FRONTEND_DOMAIN,
			// });
			console.log(jwtsign)
			res.clearCookie('jwt', {path: '/' });
			res.cookie('jwt', jwtsign, {
				path: '/',
				sameSite: 'strict',
				httpOnly : true,
				secure : true,
				domain: process.env.FRONTEND_DOMAIN,
			});
			res.status(200).send('NewToken');
			// res.redirect("http://localhost:3000/")
		}
		catch(error)
		{
			// res.clearCookie('jwt', {path: '/' });
			// res.redirect("http://localhost:3000/auth")
			console.log('logout');
			res.status(403).send('forbidden');
			// throw error;
		}
	}




	@Get('logout')//Change Get into put
	//@UseGuards(AuthGuard)
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
