import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js';
import * as argon from "argon2";
import { JoinChannelDto, NewChannelDto } from './dto';
import { Channel, ChannelUser, Message } from '@prisma/client';
import { ChannelName, ChannelWithRelation, UserInChannel } from './chat.types';

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
			const user: ChannelUser = channel.users.find(user => user.userId === userId);
			if (channel.private && !user)
				throw new HttpException('This is a private channel', HttpStatus.BAD_REQUEST);
			if (user) {
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

	async getChannels(userId: number): Promise<ChannelName[]> {
		try {
			const channels: ChannelName[] = await this.prisma.channel.findMany({
				where: {
					users: {
						some: {
							userId: userId,
						},
					},
				},
				select:{
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

	async getChannelUsers(name: string): Promise<UserInChannel[]> {
		try {
			const channel = await this.prisma.channel.findUnique({
				where: {
					name: name,
				},
				include: {
					users: {
						select: {
							user: {
								select: {
									name: true,
									pseudo: true,
									avatar: true,
									photo42: true,
								}
							},
							userId: true,
							owner: true,
							admin: true,
							member: true,
							banned: true,
							muted: true,
							invited: true,
						}
					},
				},
			});

			// Extract and structure the data
			const users: UserInChannel[] = channel.users.map(channelUser => ({
				userId: channelUser.userId,
				name: channelUser.user.name,
				pseudo: channelUser.user.pseudo,
				avatar: channelUser.user.avatar,
				photo42: channelUser.user.photo42,
				owner: channelUser.owner,
				admin: channelUser.admin,
				member: channelUser.member,
				banned: channelUser.banned,
				muted: channelUser.muted,
				invited: channelUser.invited,
			}));
			return users
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError)
				throw new HttpException(`Prisma error : ${error.code}`, HttpStatus.INTERNAL_SERVER_ERROR);
		throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async getMessages(name: string): Promise<Message[]> {
		try {
			const messages: Message[] = await this.prisma.message.findMany({
				where: {
					channelName: name
				}
			})
			return messages
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError)
				throw new HttpException(`Prisma error : ${error.code}`, HttpStatus.INTERNAL_SERVER_ERROR);
		throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
