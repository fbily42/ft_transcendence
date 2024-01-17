import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from "argon2";
import { JoinChannelDto, NewChannelDto } from './dto';
import { Channel, ChannelInvited, ChannelMember } from '@prisma/client';

@Injectable()
export class ChatService {
	constructor(private prisma: PrismaService) {}

	async createChannel(userId: number, dto: NewChannelDto): Promise<Channel> {
		try {
			let hash: string = null;
			if (dto.password)
				hash = await argon.hash(dto.password);
			const channel: Channel = await this.prisma.channel.create({
				data: {
					name: dto.name,
					private: dto.private,
					hash: hash,
					owner: {
						connect: {
							id: userId,
						},
					},
				},
			});
			delete channel.hash;
			return channel;
		} catch(error) {
			if (error instanceof PrismaClientKnownRequestError){
				if (error.code === 'P2002')
					throw new HttpException('Channel already exists', HttpStatus.CONFLICT);
			}
			throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async joinChannel(userId :number, dto: JoinChannelDto): Promise<ChannelMember>{
		try {
			const channel: Channel = await this.prisma.channel.findUnique({
				where: {
					name: dto.name,
				},
				},
			);
			if (!channel)
				throw new HttpException('Channel does not exists', HttpStatus.BAD_REQUEST);
			if (channel.private)
			{
				const invited: ChannelInvited = await this.prisma.channelInvited.findUnique({
					where:{
						channelId_userId:{
						userId: userId,
						channelId: channel.id,
						},
					},
				});
				if (!invited)
					throw new HttpException('This is a private channel', HttpStatus.BAD_REQUEST);
			}
			if (channel.hash)
			{
				if (!await argon.verify(channel.hash, dto.password))
					throw new HttpException("Bad credentials", HttpStatus.BAD_REQUEST);
			}
			const joined: ChannelMember = await this.prisma.channelMember.create({
				data:{
					userId: userId,
					channelId: channel.id,
				},
			});
			return joined;
		} catch (error) {
			if (error instanceof HttpException || error instanceof PrismaClientKnownRequestError)
				throw error;
			throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
