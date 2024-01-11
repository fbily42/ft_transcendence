import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService, private jwtService :JwtService) {}

	async getInfo(jwt :any) {

		const jwtPayload = this.jwtService.decode(jwt)
		
		const user = await this.prisma.user.findUnique({
			where:{
				name: jwtPayload.login,
			},
		})
		if (!user)
			return null
		delete user.token42
		delete user.jwt
		return user;
	}
}
