import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({})
export class AuthService {
	constructor(private prisma: PrismaService) {}

	async getToken(code :string){

		//console.log(` Client UID : ${process.env.CLIENT_UID}\n Client Secret : ${process.env.CLIENT_SECRET}\n Code : ${code}\n Redirect_uri : ${process.env.REDIRECT_URI}`);
		const response = await fetch("https://api.intra.42.fr/oauth/token",
		{
			method: "POST",
			headers: {
				"Content-Type": 'application/x-www-form-urlencoded',
			  },
			body: `grant_type=authorization_code&client_id=${process.env.CLIENT_UID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}&redirect_uri=${process.env.REDIRECT_URI}`,
		})

		const token = await response.json();
		return token;
	};

	async getUserLogin(token :any){

		const response = await fetch("https://api.intra.42.fr/v2/me", {
			headers: {Authorization: `Bearer ${token.access_token}`}
		});

		const user = await response.json();
		return user.login;
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
				hash: 'test',
				token42: token,
				status: 'online',
			},
		});
		return user;
	}
}
