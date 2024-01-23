import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as OTPAuth from "otpauth";
import { encode, decode } from "hi-base32";


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

	async findUser(login :string, token :any, photo :string){

		try {
			const user = await this.prisma.user.findUnique({
				where:{
					name: login,
				}
			})
			if (!user)
			{
				return this.createUser(login, token, photo);
			}
			return user;
		}
		catch(error){
			throw error;
		}
	}

	async createUser(login: string, token :any, photo: string) {

		try {
			const user = await this.prisma.user.create({
				data: {
					name: login,
					token42: token,
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
			const payload = {
				sub: user.id,
				login: user.name,
				otp_enabled: user.otp_enabled,
				otp_provided: false,
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
		catch(error){
			throw error;
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

			//Generates a key
			const base32_secret : string = this.generateOtpSecret();
			
			//Instantiate a TOTP object
			const TOTP = new OTPAuth.TOTP({
				algorithm: "SHA256",
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
					otp_secret: base32_secret,
					otp_url: url,
				},
			});

			return {otp_secret: base32_secret, otp_url: url};
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
				algorithm: "SHA256",
				digits: 6,
				issuer: "Pinguscendence",
				issuerInLabel: true,
				period: 30,
				secret: user.otp_secret,
			});

			const delta = TOTP.validate({token});

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
					otp_enabled: true,
					otp_verified: true,
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
					otp_enabled: false,
				},
			});
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

			if (user.otp_verified) {
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
					otp_enabled: true,
				},
			});
		}
		catch (error) {
			error
		}
	}
}
