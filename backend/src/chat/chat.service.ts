import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from "argon2";
import { NewChannelDto, joinChannelDto } from './dto';

@Injectable()
export class ChatService {
	constructor(private prisma: PrismaService) {}

	async createChannel(userId: number, dto: NewChannelDto) {
		try {
			let hash: string = null
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

	async joinChannel(userId :number, dto: joinChannelDto) {
		try {
			const channel = this.prisma.channel.findUnique({
				where: {
					name: dto.name,
				},
				}
			)
			if ((await channel).private)
			{
				// Check if user is in invited list of the channel
				// else throw Exception
				return
			}
			if ((await channel).hash)
			{
				const hash: string = await argon.hash(dto.password)
				if (hash != (await channel).hash)
					throw new HttpException("Bad credentials", HttpStatus.BAD_REQUEST)
			}
			// Add User to ChannelMember relation
		} catch (error) {
			// if prismaknowerror ->
			// else throw error
		}

	}
}
