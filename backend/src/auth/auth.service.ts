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
			const signrefreshToken = await this.jwt.signAsync(payload, {expireIn: '7h'});


			//recuperer
			const updateUser = await this.prisma.user.update({
				where: {
					id: user.id,
				},
				data: {
					refreshToken : {push: signrefreshToken},
					jwt: {push: signedJwt},
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
			// console.log('bonjour', jwtoken);
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
			const updatejwt = updateUser.jwt.filter(item => item !== jwtoken);
			const updateUser2 = await this.prisma.user.update({
				where: { id: decode.sub },
				data: {
					jwt: { set: updatejwt},
				},
			});


		}
		catch(error){
			console.log('issu in deletokens');
			throw error;
		}
	}

	async refreshTheToken(jwtoken :String)
	{
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					OR: [
						{jwt : jwtoken},
						{Ban_jwt : jwtoken},
					],
				},
			});
			if (!user)
			{
				//il demande un token alors qu'il n'en a pas
				//il faut le logout
				throw new Error('User not found');
			}
			else if (user.Ban_jwt.includes(jwtoken))
			{
				//il essaye de se log avec un token qui a deja servi, donc posisble leak
				//il faut log out
				//soit coter backend soit coter client a verifier
				throw new Error('Token already used');
			}
			this.jwt.verify(user.refreshToken)
			const payload = {
				sub: user.id,
				login: user.name
			};

			//il a un token
			const signedJwt = await this.jwt.signAsync(payload);
			// Première mise à jour pour supprimer l'ancien token
			await this.prisma.user.update({
				where: {
					id: user.id,
				},
				data: {
					jwt: {
						pull: jwtoken,
					},
					Ban_jwt: {push: jwtoken,},
				},
			});

			// Deuxième mise à jour pour ajouter le nouveau token
			await this.prisma.user.update({
				where: {
					id: user.id,
				},
				data: {
					jwt: {
						push: signedJwt,
					},
					Log_in: true,
				},
			});

			return signedJwt;

		}
		catch (error)
		{
			//le refresh token est finis
			//logout
			throw error;
		}
	}
}
