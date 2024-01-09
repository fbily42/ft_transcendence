import { Controller, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Controller ('auth')
export class AuthController{
	constructor(private authService: AuthService) {}

	@Get('42')
	async getCode(@Req() req : Request) {
		const code = req.query.code as string;
		
		// console.log(` Client UID : ${process.env.CLIENT_UID}\n Client Secret : ${process.env.CLIENT_SECRET}\n Code : ${code}\n Redirect_uri : ${process.env.REDIRECT_URI}`);
		const response = await fetch("https://api.intra.42.fr/oauth/token",
		{
			method: "POST",
			headers: {
				"Content-Type": 'application/x-www-form-urlencoded',
			  },
			body: `grant_type=authorization_code&client_id=${process.env.CLIENT_UID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}&redirect_uri=${process.env.REDIRECT_URI}`,
		})

		return {...response};
	}
}