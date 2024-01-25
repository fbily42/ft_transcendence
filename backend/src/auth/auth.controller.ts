import { Controller, Get, Post, Req, Res, UseGuards, HttpCode, Delete, Put } from '@nestjs/common';
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
			const {login, photo} = await this.authService.getUserLogin(token);

			// Find if User exists, create if doesnt
			const user = await this.authService.findUser(login, token, photo);
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

  
	@UseGuards(AuthGuard)
	@Post('otp/generate')
	async generateOtp(@Req() req : Request, @Res() res: Response) {
		try {
			//generate secret and url and stores it 
			const otp = await this.authService.generateOtp(req['userID']);

			//send base32_secret and url
			res.status(HttpStatus.OK).send(otp);
		}
		catch(error) {
			throw new HttpException("Internal server error" , HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@UseGuards(AuthGuard)
	@Post('otp/verify')
	async verifyOtp(@Req() req: Request, @Res() res: Response) {
		try {
			//retrieve token
			const token = req.query?.token as string;

			//verify token
			const isTokValid = await this.authService.verifyOtp(req['userID'], token);

			if (!isTokValid)
				return res.status(HttpStatus.UNAUTHORIZED).json({error: "Token is invalid"});

			//updates DB
			await this.authService.setOtpAsVerified(req['userID']);

			res.status(HttpStatus.ACCEPTED).send({message: "2FA successfully set up"});
		}
		catch(error) {
			throw new HttpException("Internal server error" , HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@UseGuards(AuthGuard)
	@Post('otp/validate')
	async validateOtp(@Req() req: Request, @Res() res: Response) {
		try {
			//retrieve token
			const token = req.query?.token as string;

			//verify token
			const isTokValid = await this.authService.verifyOtp(req['userID'], token);

			if (!isTokValid)
				return res.status(HttpStatus.UNAUTHORIZED).json({error: "Token is invalid"});

			res.status(HttpStatus.ACCEPTED).send({message: "2FA token successfully validated"});
		}
		catch(error) {
			throw new HttpException("Internal server error" , HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@UseGuards(AuthGuard)
	@Post('otp/disable')
	async disableOtp(@Req() req: Request, @Res() res: Response) {
		try {
			await this.authService.disableOtp(req['userID']);
			res.status(HttpStatus.OK).send({message: "2FA successfully disabled"});
		}
		catch(error) {
			throw new HttpException("Internal server error" , HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@UseGuards(AuthGuard)
	@Post('otp/enable')
	async enableOtp(@Req() req: Request, @Res() res: Response) {
		try {
			const isOtpVerified = await this.authService.isOtpVerified(req['userID']);
			
			if (!isOtpVerified)
				return res.status(HttpStatus.UNAUTHORIZED).json({error: "2FA is not set up and verified"});
			
			await this.authService.enableOtp(req['userID']);
			res.status(HttpStatus.OK).send({message: "2FA successfully enabled"});
		}
		catch(error) {
			throw new HttpException("Internal server error" , HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

	@Get('refresh-token')//Mettre un put au lieu de Get 
	async refreshToken(@Req() req : Request, @Res() res : Response)
	{

		try{
			const jwt = req.cookies['jwt'] as string;
			res.clearCookie('jwt', {path: '/' });
			const jwtsign: string = await this.authService.refreshTheToken(jwt);
			res.cookie('jwt', jwtsign, {
				path: '/',
				sameSite: 'strict',
				httpOnly : true,
				secure : true,
				domain: process.env.FRONTEND_DOMAIN,
			});
			res.status(200).send('NewToken');
		}
		catch(error)
		{
			res.status(403).send('forbidden');
		}
	}



	@Get('logout')//Change Get into put
	//@UseGuards(AuthGuard)
	async logout(@Req() req : Request, @Res() res : Response): Promise<void> {

		try {

			const jwt = req.cookies['jwt'] as string;
			//supprimer le cookie

			//gerer la mise a jour de mon token
			res.clearCookie('jwt', {path: '/' });
			await this.authService.deleteTokens(jwt);
			res.status(200).send('Successfully logged out');

		} catch (error) {
			res.status(500).send('Error during log out');
		}
	}
}
/*

To find Cookie in Chrome :

	Inspect (F12) -> Appplication -> Cookies

*/
