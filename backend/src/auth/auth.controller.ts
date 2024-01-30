import { Controller, Get, Post, Req, Res, UseGuards, HttpCode, Delete, Put, Query, Body, UsePipes, ValidationPipe, ParseUUIDPipe, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';
import { HttpException, HttpStatus } from '@nestjs/common';
import { IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { OtpDto, UuidDto } from './auth.dto';


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

			if (user.otp_enabled && user.otp_verified) {
				const uuid = await this.authService.setRequestUuid(user);
				res.redirect(`${process.env.FRONTEND_URL}/auth/twofa/${uuid}`);
				return;
			}
			// Create JWT and add to the user in DB
			const jwt = await this.authService.createJwt(user);

			// Create cookie for browser
			res.cookie('jwt', jwt, {
				sameSite: 'strict',
				httpOnly : true,
				// secure : true,
				domain: process.env.FRONTEND_DOMAIN,
			});
			res.redirect(`${process.env.FRONTEND_URL}`);

		} catch(error) {
			res.redirect(`${process.env.FRONTEND_URL}/auth`);
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

	@Post('otp/removeUuid')
	async removeUuid(@Res() res: Response, @Body() uuidDto: UuidDto){
		try {
			const result = await this.authService.removeUuid(uuidDto.uuid);
			res.status(HttpStatus.OK);
		}
		catch (error) {
			throw new HttpException("Internal server error" , HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Get('otp/uuidExists/:uuid')
	async uuidExists(@Res() res: Response, @Param('uuid', ParseUUIDPipe) uuid: string){
		try {
			const result = await this.authService.requestExists(uuid);
			let msg;
			if (result){
				res.status(HttpStatus.OK);
				msg = "Request exists";
			}
			else {
				res.status(HttpStatus.FORBIDDEN);
				msg = "Request does not exist";
			}
			res.send({message: msg});
		}
		catch (error) {
			throw new HttpException("Internal server error" , HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Post('otp/validate')
	@UsePipes(new ValidationPipe({ transform: true }))
	async validateOtp(@Res() res: Response, @Body() otpDto : OtpDto) {
		try {
			//retrieve token
			const {token, uuid} = otpDto;

			//retrieve user corresponding to request uuid
			const user = await this.authService.requestExists(uuid);

			if (!user)
				return res.status(HttpStatus.UNAUTHORIZED).json({error: "Token is invalid"});

			//verify token
			const isTokValid = await this.authService.verifyOtp(user.id, token);

			if (!isTokValid)
				return res.status(HttpStatus.UNAUTHORIZED).json({error: "Token is invalid"});

			//removes request uuid from DB
			// const remove = await this.authService.removeUuid(uuid);

			//creates and sets jwt cookie
			const jwt = await this.authService.setJwt(user.id);

			res.cookie('jwt', jwt, {
				sameSite: 'strict',
				httpOnly : true,
				domain: process.env.FRONTEND_DOMAIN,
				path: "/",
			});
			res.status(HttpStatus.ACCEPTED);
			res.send({message: "2FA token successfully validated"});
		}
		catch(error) {
			// throw error
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



	@UseGuards(AuthGuard)
	@Get('logout')//Change Get into put
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
