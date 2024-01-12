import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from "argon2";

@Injectable()
export class ChatService {
	constructor(private prisma: PrismaService) {}

	async createChannel(userId: number, dto: ChannelDto) {
		try {
			let hash = null
			if (dto.password)
				hash = await argon.hash(dto.password)
			const channel = await this.prisma.channel.create({
				data: {
					name: dto.name,
					private: dto.private,
					hash: hash,
					owner: {
						connect: {
							id: userId,
						}
					}
				},
			});
			delete channel.hash
			return channel			
		} catch(error) {
			if (error instanceof PrismaClientKnownRequestError){
				if (error.code === 'P2002')
				{
					throw new HttpException('Channel already exists', HttpStatus.CONFLICT)
				}
			}
			throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
		}
	}
}
