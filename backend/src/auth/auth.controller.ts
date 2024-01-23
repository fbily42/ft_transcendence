import { Controller, Get, Post, Req, Res, UseGuards, HttpCode } from '@nestjs/common';
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
			console.log("1. Retrieved code");

			console.log("2. Fetch POST 42AuthServer for access_token");
			// Get the token access from 42api
			const token = await this.authService.getToken(code);
			console.log("3. Retrieved access_token");

			console.log("4. Fetch GET 42API for user");
			// Get the login of the user from 42api
			const {login, photo} = await this.authService.getUserLogin(token);
			
			console.log("5. Look for user in DB");
			// Find if User exists, create if doesnt
			const user = await this.authService.findUser(login, token, photo);
			
			console.log("6. Creates JWT and stores it in DB");
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
}
/* 

To find Cookie in Chrome :

	Inspect (F12) -> Appplication -> Cookies

*/