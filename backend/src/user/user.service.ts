import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async createUser(dto: UserDto) {

		const user = await this.prisma.user.create({
			data: {
				name: dto.name,
				hash: dto.hash,
				tokenAuth: dto.tokenAuth,
				status: dto.status,
			},
		});
		return user;
	}
}
