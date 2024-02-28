import {
	Controller,
	Get,
	Post,
	Req,
	Res,
	UseGuards,
	HttpCode,
	Put,
	Body,
	UsePipes,
	ValidationPipe,
	ParseUUIDPipe,
	Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';
import { HttpException, HttpStatus } from '@nestjs/common';
import { OtpDto, UuidDto, TokenDto } from './auth.dto';
import { User } from '@prisma/client';


type all_token = {
	signedJwt: string;
	signedrefreshToken: string;
}

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Get('42')
	async login(@Req() req: Request, @Res() res: Response) {
		try {
			const code = req.query?.code as string;

			if (!code || req.query?.error) {
				throw new HttpException(
					'Access denied',
					HttpStatus.UNAUTHORIZED,
				);
			}

			// Get the token access from 42api
			const token = await this.authService.getToken(code);

			// Get the login of the user from 42api
			const { login, photo } = await this.authService.getUserLogin(token);

			// Find if User exists, create if doesnt
			const user: User = await this.authService.findUser(
				login,
				photo,
			);

			if (user.otpEnabled && user.otpVerified) {
				const uuid = await this.authService.setrequestUuid(user);
				res.redirect(`${process.env.FRONTEND_URL}/auth/twofa/${uuid}`);
				return;
			}

			// Create JWT and add to the user in DB
			const all_token: all_token = await this.authService.createJwt(user);

			// Create cookie for browser
			res.cookie('jwt', all_token.signedJwt, {
				sameSite: 'strict',
				httpOnly: true,
				// secure : true,
				domain: process.env.FRONTEND_DOMAIN,
			});

			res.cookie('jwt_refresh', all_token.signedrefreshToken, {
				sameSite: 'strict',
				httpOnly: true,
				// secure : true,
				domain: process.env.FRONTEND_DOMAIN,
			});
			if (!user.avatar || !user.pseudo) {
				res.redirect(`${process.env.FRONTEND_URL}/auth`);
				return;
			}
			res.redirect(`${process.env.FRONTEND_URL}`);
		} catch (error) {
			res.redirect(`${process.env.FRONTEND_URL}/auth`);
			throw error;
		}
	}

	@Get('isAuth')
	@UseGuards(AuthGuard)
	@HttpCode(200)
	async isAuthentified(@Res() res: Response) {
		res.status(200).send({
			status: 'OK',
			message: 'User is authenticated',
		});
	}

	@Get('isProfileSet')
	@UseGuards(AuthGuard)
	async isProfileSet(@Req() req: Request, @Res() res: Response) {
		try {
			const isSet = await this.authService.isProfileSet(req['userLogin']);
			if (isSet) {
				res.status(200).send({
					status: 'OK',
					message: 'User profile is set',
				});
			} else {
				res.status(HttpStatus.UNAUTHORIZED).send({
					status: 'NOT SET',
					message: 'User profile is not set',
				});
			}
		} catch (error) {
			throw new HttpException(
				'Internal server error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@UseGuards(AuthGuard)
	@Get('otp/generate')
	async generateOtp(@Req() req: Request, @Res() res: Response) {
		try {
			//generate secret and url and stores it
			const otp = await this.authService.generateOtp(req['userID']);

			//send base32_secret and url
			res.status(HttpStatus.OK).send(otp);
		} catch (error) {
			throw new HttpException(
				'Internal server error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@UseGuards(AuthGuard)
	@Post('otp/verify')
	async verifyOtp(
		@Req() req: Request,
		@Res() res: Response,
		@Body() tokenDto: TokenDto,
	) {
		try {
			//retrieve token
			const { token } = tokenDto;

			//verify token
			const isTokValid = await this.authService.verifyOtp(
				req['userID'],
				token,
			);

			if (!isTokValid)
				return res
					.status(HttpStatus.UNAUTHORIZED)
					.json({ error: 'Token is invalid' });

			//updates DB
			await this.authService.setOtpAsVerified(req['userID']);

			res.status(HttpStatus.ACCEPTED).send({
				message: '2FA successfully set up',
			});
		} catch (error) {
			throw new HttpException(
				'Internal server error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Post('otp/removeUuid')
	async removeUuid(@Res() res: Response, @Body() uuidDto: UuidDto) {
		try {
			const result = await this.authService.removeUuid(uuidDto.uuid);
			res.status(HttpStatus.OK);
		} catch (error) {
			throw new HttpException(
				'Internal server error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Get('otp/uuidExists/:uuid')
	async uuidExists(
		@Res() res: Response,
		@Param('uuid', ParseUUIDPipe) uuid: string,
	) {
		try {
			const result = await this.authService.requestExists(uuid);
			let msg;
			if (result) {
				res.status(HttpStatus.OK);
				msg = 'Request exists';
			} else {
				res.status(HttpStatus.FORBIDDEN);
				msg = 'Request does not exist';
			}
			res.send({ message: msg });
		} catch (error) {
			throw new HttpException(
				'Internal server error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Post('otp/validate')
	@UsePipes(new ValidationPipe({ transform: true }))
	async validateOtp(@Res() res: Response, @Body() otpDto: OtpDto) {
		try {
			//retrieve token
			const { token, uuid } = otpDto;

			//retrieve user corresponding to request uuid
			const user = await this.authService.requestExists(uuid);

			if (!user)
				return res
					.status(HttpStatus.UNAUTHORIZED)
					.json({ error: 'Token is invalid' });

			//verify token
			const isTokValid = await this.authService.verifyOtp(user.id, token);

			if (!isTokValid)
				return res
					.status(HttpStatus.UNAUTHORIZED)
					.json({ error: 'Token is invalid' });

			//creates and sets jwt cookie
			const tokens: all_token = await this.authService.setJwt(user.id);

			res.cookie('jwt', tokens.signedJwt, {
				sameSite: 'strict',
				httpOnly: true,
				// secure : true,
				domain: process.env.FRONTEND_DOMAIN,
			});

			res.cookie('jwt_refresh', tokens.signedrefreshToken, {
				sameSite: 'strict',
				httpOnly: true,
				// secure : true,
				domain: process.env.FRONTEND_DOMAIN,
			});

			res.status(HttpStatus.ACCEPTED);
			res.send({ message: '2FA token successfully validated' });
		} catch (error) {
			// throw error
			throw new HttpException(
				'Internal server error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@UseGuards(AuthGuard)
	@Get('otp/twoFAState')
	async getTwoFAstate(@Req() req: Request, @Res() res: Response) {
		try {
			const isTwoFAEnabled = await this.authService.isOtpEnabled(
				req['userID'],
			);
			const isTwoFAVerified = await this.authService.isOtpVerified(
				req['userID'],
			);
			res.status(HttpStatus.OK).send({
				twoFAEnabled: isTwoFAEnabled,
				twoFAVerified: isTwoFAVerified,
			});
		} catch (error) {
			throw new HttpException(
				'Internal server error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@UseGuards(AuthGuard)
	@Post('otp/disable')
	async disableOtp(@Req() req: Request, @Res() res: Response) {
		try {
			await this.authService.disableOtp(req['userID']);
			res.status(HttpStatus.OK).send({
				message: '2FA successfully disabled',
			});
		} catch (error) {
			throw new HttpException(
				'Internal server error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@UseGuards(AuthGuard)
	@Post('otp/enable')
	async enableOtp(@Req() req: Request, @Res() res: Response) {
		try {
			const isOtpVerified = await this.authService.isOtpVerified(
				req['userID'],
			);

			if (!isOtpVerified)
				return res
					.status(HttpStatus.UNAUTHORIZED)
					.json({ error: '2FA is not set up and verified' });

			await this.authService.enableOtp(req['userID']);
			res.status(HttpStatus.OK).send({
				message: '2FA successfully enabled',
			});
		} catch (error) {
			throw new HttpException(
				'Internal server error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Put('refresh-token')
	async refreshToken(@Req() req: Request, @Res() res: Response) {
		try {
			const token_refresh = req.cookies['jwt_refresh'] as string;
			const token = req.cookies['jwt'] as string;
			res.clearCookie('jwt', { path: '/' });

			const signNewToken: string = await this.authService.refreshTheToken(
				token_refresh,
				token,
			);
			res.cookie('jwt', signNewToken, {
				path: '/',
				sameSite: 'strict',
				httpOnly: true,
				// secure : true,
				domain: process.env.FRONTEND_DOMAIN,
			});

			res.status(200).send('NewToken');
		} catch (error) {
			res.status(403).send('forbidden');
		}
	}

	@Put('logout')
	// @UseGuards(AuthGuard)
	async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
		try {
			const jwt_refresh = req.cookies['jwt_refresh'] as string;
			//supprimer le cookie

			//gerer la mise a jour de mon token
			res.clearCookie('jwt', { path: '/' });
			res.clearCookie('jwt_refresh', { path: '/' });
			await this.authService.deleteTokens(jwt_refresh);
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
