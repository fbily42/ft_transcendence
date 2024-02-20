import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as OTPAuth from "otpauth";
import { encode, decode } from "hi-base32";
import { v1 as uuidv1 } from 'uuid';
import { PayloadToResult } from '@prisma/client/runtime/library';

export interface Payload_type {
	sub: string;
	login: string;
  }

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
			return {login: user.login,
				photo: user.image.link};

		} catch(error)
		{
			throw error;
		}
	};

	async findUser(login :string, photo :string){

		try {
			const user: User = await this.prisma.user.findUnique({
				where:{
					name: login,
				}
			});
			if (!user)
			{
				return this.createUser(login, photo);
			}
			return user;
		}
		catch(error){
			throw error;
		}
	}

	async createUser(login: string, photo: string) {

		try {
			const user: User = await this.prisma.user.create({
				data: {
					name: login,
					photo42: photo,
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
			const payload: Payload_type = {
				sub: user.id,
				login: user.name,
			};

			const signedJwt: string  = await this.jwt.signAsync(payload);
			const signedrefreshToken: string = await this.jwt.signAsync(payload, {expiresIn: '7h'});

			//Pas sur d'avoir besoin d'avoir ce call si on a plus de jwt a stocker et qu'on stocke plus non plus le refresh
			const updateUser: User = await this.prisma.user.update({
				where: {
					id: user.id,
				},
				data: {
					jwt: {push: signedJwt},
				},
			});

			return {signedJwt, signedrefreshToken};
		}
		catch(error){
			throw error;
		}
	}

	async setJwt(userID: string){
		try {
			//Find user
			const user = await this.prisma.user.findUnique({
				where:{
					id: userID,
				}
			})
			if (!user)
				throw new Error();
			
			//Creates jwt
			return this.createJwt(user);
			
		}
		catch (error) {
			throw error;
		}

	}

	async setrequestUuid(user: any) {
		try {
			//Generate UUID
			const uuid = uuidv1();
			const updateUser = await this.prisma.user.update({
				where: {
					id: user.id,
				},
				data: {
					requestUuid : uuid,
				},
			});
			return (uuid);
		}
		catch(error){
			throw error;
		}

	}

	async isProfileSet(userID: string) {
		try {
			const user = await this.prisma.user.findUnique({
				where:{
					name: userID,
				}
			});

			if (user.avatar && user.pseudo) {
				return true;
			}
			return false;
		}
		catch (error){
			throw error;
		}
	}

	async requestExists(uuid: string) {
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					requestUuid : uuid,
				}
			})
			return (user);
		}
		catch(error) {
			throw error;
		}
	}

	async removeUuid(uuid: string) {
		try {
			const user = await this.requestExists(uuid);
			if (user) {
				const updated = await this.prisma.user.update({
					where: {
						id: user.id,
					},
					data: {
						requestUuid: null,
					},
				})
			}
		}
		catch(error) {
			throw (error);
		}
	}

	generateOtpSecret() : string {
		try {
			const keyLength = 15;
			const buffer = new Uint8Array(keyLength);
			crypto.getRandomValues(buffer);
			const secret = encode(buffer);
			return secret ;
		}
		catch (error) {
			throw error;
		}
	}

	async generateOtp(userID) {
		try {
			//Look for user in DB
			const user = await this.prisma.user.findUnique({
				where : {
					id: userID,
				}
			});

			if (user && user.otpSecret && user.otpUrl)
				return {otpSecret: user.otpSecret, otpUrl: user.otpUrl};

			//Generates a key
			const base32_secret : string = this.generateOtpSecret();
			
			//Instantiate a TOTP object
			const TOTP = new OTPAuth.TOTP({
				algorithm: "SHA1",
				digits: 6,
				issuer: "Pinguscendence",
				issuerInLabel: true,
				period: 30,
				secret: base32_secret,
			})
			
			//Generates the TOTP url
			const url = TOTP.toString();

			//Stores the generated secret and url in DB
			const updateUser = await this.prisma.user.update({
				where: {
					id: userID,
				},
				data: {
					otpSecret: base32_secret,
					otpUrl: url,
				},
			});

			return {otpSecret: base32_secret, otpUrl: url};
		}
		catch (error) {
			throw error;
		}
	}

	async verifyOtp(userID, token) : Promise<boolean> {
		try {
			const user = await this.prisma.user.findUnique({
				where : {
					id: userID,
				}
			});

			const TOTP = new OTPAuth.TOTP({
				algorithm: "SHA1",
				digits: 6,
				issuer: "Pinguscendence",
				issuerInLabel: true,
				period: 30,
				secret: user.otpSecret,
			});

			const delta = TOTP.validate({token, window: 2});

			if (delta === null)
				return false

			return true;
		}
		catch (error) {
			throw error;
		}
	}

	async setOtpAsVerified(userID) {
		try {
			await this.prisma.user.update({
				where: {
					id: userID,
				},
				data: {
					otpEnabled: true,
					otpVerified: true,
				},
			});
		}
		catch(error) {
			throw error;
		}
	}

	async disableOtp(userID) {
		try {
			await this.prisma.user.update({
				where: {
					id: userID,
				},
				data: {
					otpEnabled: false,
				},
			});
		}
		catch(error) {
			throw error;
		}
	}

	async isOtpEnabled(userID) : Promise<boolean> {
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					id: userID,
				},
			});

			if (user.otpEnabled) {
				return true
			}
			return false;
		}
		catch(error) {
			throw error;
		}
	}

	async isOtpVerified(userID) : Promise<boolean> {
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					id: userID,
				},
			});

			if (user.otpVerified) {
				return true
			}
			return false;
		}
		catch(error) {
			throw error;
		}
	}

	async enableOtp(userID) {
		try {
			await this.prisma.user.update({
				where: {
					id: userID,
				},
				data: {
					otpEnabled: true,
				},
			});
		}
		catch (error) {
			error
		}
	}

	async deleteTokens(jwt_refresh : string){

		try {
			const decode: Payload_type = this.jwt.verify(jwt_refresh);

			await this.prisma.user.update({
				where: {
					id: decode.sub,
				},
				data: {
					banJwt: {push: jwt_refresh},
				},
			});
		}
		catch(error){
			throw new HttpException("Token already used", HttpStatus.FORBIDDEN);
		}
	}

	async refreshTheToken(token_refresh: string, token: string)
	{
		try {
			if(!token)
				throw new HttpException("Token doesn't exist", HttpStatus.NOT_FOUND);
			this.jwt.verify(token);
			if(!token_refresh)//il faut log out
			{
				throw new HttpException("Token already used", HttpStatus.NOT_FOUND);
			}
			const client: Payload_type = this.jwt.verify(token_refresh);
			const user: User= await this.prisma.user.findUnique({
				where: {
					id : client.sub,
				},
			});

			if (!user)
			{
				throw new HttpException("No user found", HttpStatus.NOT_FOUND);
			}
			else if (user.banJwt.find(token => token === token_refresh))
			{
				throw new HttpException("Token already used", HttpStatus.FORBIDDEN);
			}
			
			const payload: Payload_type = {
				sub: user.id,
				login: user.name
			};

			const signedJwt: string = await this.jwt.signAsync(payload);

			return signedJwt;

		}
		catch (error)
		{
			throw error;
		}
	}
}
