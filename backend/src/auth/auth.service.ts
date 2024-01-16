import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';


@Injectable({})
export class AuthService {
	constructor(private prisma: PrismaService,
		private jwt : JwtService) {}

	async getToken(code :string){

		try {

			const response = await fetch("https://api.intra.42.fr/oauth/token",
			{
				method: "POST",
				headers: {
					"Content-Type": 'application/x-www-form-urlencoded',
				  },
				body: `grant_type=authorization_code&client_id=${process.env.CLIENT_UID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}&redirect_uri=${process.env.REDIRECT_URI}`,
			})
	
			if (!response.ok){
				throw new HttpException('Unexpected HTTP error ', HttpStatus.INTERNAL_SERVER_ERROR);//check HttpStatus
				
				//throw new Error(`Erreur HTTP : ${response.status} - ${response.statusText}`;)
			}
			const token = await response.json();
			return token;
		} catch(error)
		{
			throw new HttpException('Unexpected HTTP error ', HttpStatus.INTERNAL_SERVER_ERROR);//check HttpStatus
		}		//console.log(` Client UID : ${process.env.CLIENT_UID}\n Client Secret : ${process.env.CLIENT_SECRET}\n Code : ${code}\n Redirect_uri : ${process.env.REDIRECT_URI}`);
	};

	async getUserLogin(token :any){

		try {
			const response = await fetch("https://api.intra.42.fr/v2/me", {
				headers: {Authorization: `Bearer ${token.access_token}`}
			});
			
			if (!response.ok)
				throw new HttpException('Unexpected HTTP error ', HttpStatus.INTERNAL_SERVER_ERROR);//check HttpStatus

				
			const user = await response.json();
			return user.login;

		} catch(error)
		{
			throw new HttpException('Unexpected HTTP error ', HttpStatus.INTERNAL_SERVER_ERROR);//check HttpStatus

		}	
	};

	async findUser(login :string, token :any){

		const user = await this.prisma.user.findUnique({
			where:{
				name: login,
			}
		})
		if (!user)
		{
			return this.createUser(login, token);
		}
		return user;
	}

	async createUser(login :string, token :any) {

		const user = await this.prisma.user.create({
			data: {
				name: login,
				token42: token,
			},
		});
		return user;
	}

	async createJwt(user: any){
		const payload = {
			sub: user.id,
			login: user.name
		};

		const signedJwt = await this.jwt.signAsync(payload);

		const updateUser = await this.prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				jwt: signedJwt,
			},
		});

		return signedJwt;
	}
}
