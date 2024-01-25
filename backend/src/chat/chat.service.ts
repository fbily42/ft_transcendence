import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from "argon2";
import { JoinChannelDto, NewChannelDto } from './dto';
import { Channel, ChannelUser, Prisma } from '@prisma/client';

type ChannelWithRelation = Prisma.ChannelGetPayload<{
	include: {
		users: true,
	}
}>

@Injectable()
export class ChatService {
	constructor(private prisma: PrismaService) {}

	async createChannel(userId: number, dto: NewChannelDto): Promise<string> {
		try {
			let hash: string = null;
			if (dto.password)
				hash = await argon.hash(dto.password);
			const channel: Channel = await this.prisma.channel.create({
				data: {
					name: dto.name,
					private: dto.private,
					hash: hash,
				},
			});
			await this.prisma.channelUser.create({
				data: {
					userId: userId,
					channelId: channel.id,
					owner: true,
				}
			})
			return channel.name;
		} catch(error) {
			if (error instanceof PrismaClientKnownRequestError){
				if (error.code === 'P2002')
					throw new HttpException('Channel already exists', HttpStatus.CONFLICT);
				else
					throw new HttpException(`Prisma error : ${error.code}`, HttpStatus.INTERNAL_SERVER_ERROR);
			}
			throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// Find the good user + check if he exists
	async joinChannel(userId :number, dto: JoinChannelDto): Promise<void>{
		try {
			const channel: ChannelWithRelation = await this.prisma.channel.findUnique({
				where: {
					name: dto.name
				},
				include:{
					users: true,
					},
			})
			if (!channel)
				throw new HttpException('Channel does not exists', HttpStatus.BAD_REQUEST);
			if (channel.hash)
			{
				if (!dto.password || !await argon.verify(channel.hash, dto.password))
					throw new HttpException("Wrong password", HttpStatus.BAD_REQUEST);
			}
			if (channel.users[0]) {
				const user: ChannelUser = channel.users.find(user => user.userId === userId);
				if (user.owner || user.member || user.muted || user.admin)
					throw new HttpException('Channel already joined', HttpStatus.CONFLICT);
				if (user.banned)
					throw new HttpException('You are banned from this channel', HttpStatus.BAD_REQUEST);
				if (channel.private)
				{
					if (!user.invited)
						throw new HttpException('This is a private channel', HttpStatus.BAD_REQUEST);
					await this.prisma.channelUser.update({
						where: {
							channelId_userId: {
								channelId: user.channelId,
								userId: userId,
							},
						},
						data: {
								invited: false,
								member: true,
							}
					})
					return;
				}
			}
			await this.prisma.channelUser.create({
				data:{
					userId: userId,
					channelId: channel.id,
					member: true,
				},
			});
			return;
		} catch (error) {
			if (error instanceof HttpException)
				throw error;
			else if (error instanceof PrismaClientKnownRequestError)
				throw new HttpException(`Prisma error : ${error.code}`, HttpStatus.INTERNAL_SERVER_ERROR);
			throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async getChannels(userId: number): Promise<any> {
		try {
			const channels: any = await this.prisma.channel.findMany({
				where: {
					users: {
						every: {
							userId: userId,
						},
					},
				},
				select:{
					id: true,
					name: true,
				},
			})
			return channels
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError)
				throw new HttpException(`Prisma error : ${error.code}`, HttpStatus.INTERNAL_SERVER_ERROR);
			throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async getChannelUsers(channelId: number): Promise<any> {
		try {
			const users: any = await this.prisma.channel.findMany({
				where: {
					id: channelId,
				},
				select: {
					id: true,
					name:true,
					users: {
						select: {
							userId: true,
							admin: true,
							member: true,
							banned: true,
							muted: true,
							invited: true,
						}
					}
				},
			})
			return users
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError)
				throw new HttpException(`Prisma error : ${error.code}`, HttpStatus.INTERNAL_SERVER_ERROR);
		throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
