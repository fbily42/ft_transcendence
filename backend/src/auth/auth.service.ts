import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as OTPAuth from "otpauth";
import { encode, decode } from "hi-base32";
import { v1 as uuidv1 } from 'uuid';


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
			});
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
			};

			const signedJwt = await this.jwt.signAsync(payload);
			const signrefreshToken = await this.jwt.signAsync(payload, {expiresIn: '7h'});

			const updateUser = await this.prisma.user.update({
				where: {
					id: user.id,
				},
				data: {
					refreshToken : signrefreshToken,
					jwt: {push: signedJwt},
				},
			});

			return signedJwt;
		}
		catch(error){
			throw error;
		}
	}

	async setJwt(userID: number){
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

	async setRequestUuid(user: any) {
		try {
			//Generate UUID
			const uuid = uuidv1();
			const updateUser = await this.prisma.user.update({
				where: {
					id: user.id,
				},
				data: {
					request_uuid : uuid,
				},
			});
			return (uuid);
		}
		catch(error){
			throw error;
		}

	}

	async requestExists(uuid: string) {
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					request_uuid : uuid,
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
						request_uuid: null,
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
				algorithm: "SHA1",
				digits: 6,
				issuer: "Pinguscendence",
				issuerInLabel: true,
				period: 30,
				secret: user.otp_secret,
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

	async deleteTokens(jwtoken : string){

		try {
			const decode = this.jwt.decode(jwtoken);

			const updateUser = await this.prisma.user.update({
				where: {
					id: decode.sub,
				},
				data: {
					Ban_jwt: {push: jwtoken},
				},
			});
		}
		catch(error){
			throw new HttpException("Token already used", HttpStatus.FORBIDDEN);
		}
	}

	async refreshTheToken(jwtoken :string)
	{
		try {
			if(!jwtoken)
			{
				throw new HttpException("Token already used", HttpStatus.NOT_FOUND);
			}
			const user = await this.prisma.user.findFirst({
				where: {
						Ban_jwt: { has: jwtoken },
				},
			});
			if (!user)
			{
				throw new HttpException("Token already used", HttpStatus.NOT_FOUND);
			}
			else if (user.Ban_jwt.find(token => token === jwtoken))
			{
				await this.prisma.user.update({
					where :{
						id : user.id
					},
					data: {
						// jwt: [],
						Ban_jwt: [],
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
