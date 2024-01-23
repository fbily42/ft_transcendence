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
			}
			const token = await response.json();
			return token;
		} catch(error)
		{
			throw error;
		}
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
			throw error;
		}
	};

	async findUser(login :string, token :any){

		try {
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
		catch(error){
			throw error;
		}
	}

	async createUser(login :string, token :any) {

		try {
			const user = await this.prisma.user.create({
				data: {
					name: login,
					token42: token,
				},
			});
			return user;
		}
		catch (error) {
			throw error;
		}
	}

	async createJwt(user: any){

		try {
			const payload = {
				sub: user.id,
				login: user.name
			};

			const signedJwt = await this.jwt.signAsync(payload);
			const signrefreshToken = await this.jwt.signAsync(payload, {expiresIn: '7h'});

			const updateUser = await this.prisma.user.update({
				where: {
					id: user.id,
				},
				data: {
					refreshToken : signrefreshToken,
					// jwt: {push: signedJwt},
					Log_in: true,
				},
			});

			return signedJwt;
		}
		catch(error){
			throw error;
		}
	}

	async deleteTokens(jwtoken : string){

		try {
			const decode = this.jwt.decode(jwtoken);

			const updateUser = await this.prisma.user.update({
				where: {
					id: decode.sub,
				},
				data: {
					Ban_jwt: {push: jwtoken},
					Log_in : false,
				},
			});
			// const updatejwt = updateUser.jwt.filter(item => item !== jwtoken);
			// const updateUser2 = await this.prisma.user.update({
			// 	where: { id: decode.sub },
			// 	data: {
			// 		jwt: { set: updatejwt},
			// 	},
			// });


		}
		catch(error){
			// console.log('issu in deletokens');
			throw new HttpException("Token already used", HttpStatus.FORBIDDEN);
		}
	}

	async refreshTheToken(jwtoken :string)
	{
		try {
			if(!jwtoken)
			{
				// console.log('auth page');
				throw new HttpException("Token already used", HttpStatus.NOT_FOUND);
			}
			const user = await this.prisma.user.findFirst({
				where: {
						Ban_jwt: { has: jwtoken },
				},
			});
			if (!user)//no user found
			{
				throw new HttpException("Token already used", HttpStatus.NOT_FOUND);
			}
			else if (user.Ban_jwt.find(token => token === jwtoken))//token already use
			{
				await this.prisma.user.update({
					where :{
						id : user.id
					},
					data: {
						// jwt: [],
						Ban_jwt: [],
						Log_in: false,
						refreshToken: null,					}

				});
				throw new HttpException("Token already used", HttpStatus.FORBIDDEN);
			}
			this.jwt.verify(user.refreshToken)
			const payload = {
				sub: user.id,
				login: user.name
			};

			const signedJwt: string = await this.jwt.signAsync(payload);
			// let updatedJwtArray = user.jwt.filter(token => token !== jwtoken);
			// updatedJwtArray.push(signedJwt);
			// console.log(updatedJwtArray);
			await this.prisma.user.update({
				where: {
					id: user.id,
				},
				data: {
					// jwt: updatedJwtArray,
					Ban_jwt: {push: jwtoken,},
				},
			});

			return signedJwt;

		}
		catch (error)
		{
			throw error;
		}
	}
}
