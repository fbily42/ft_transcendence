import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js';
import * as argon from "argon2";
import { ChannelCmdDto, JoinChannelDto, MessageDto, NewChannelDto } from './dto';
import { Channel, ChannelUser, Message, User } from '@prisma/client';
import { ChannelList, ChannelWithRelation, UserInChannel } from './chat.types';
import { InviteChannelDto } from './dto/inviteChannel.dto';

@Injectable()
export class ChatService {
	constructor(private prisma: PrismaService) {}
	public map: Map<string, any> = new Map();

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
				if (channel.private && !user.invited)
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

	async getChannels(userId: number): Promise<ChannelList[]> {
		try {
			const channels = await this.prisma.channel.findMany({
				where: {
					users: {
						some: {
							userId: userId,
						},
					},
				},
				include: {
					users: {
						select: {
							userId: true,
							banned: true,
							invited: true,
						}
					}
				}
			})

			const channelList: ChannelList[] = channels.map(channel => {
				const user = channel.users.find(user => user.userId === userId);
				return {
					name: channel.name,
					direct: channel.direct,
					invited: user?.invited,
					banned: user?.banned
				};
			});
			return channelList
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

	async inviteUser(userId: number, dto: InviteChannelDto) {
		try {
			const user: User = await this.prisma.user.findUnique({
				where: {
					name: dto.name,
				}
			});
			if (!user)
				throw new HttpException('This user does not exists', HttpStatus.BAD_REQUEST);
			const channel: ChannelWithRelation = await this.prisma.channel.findUnique({
				where: {
					name: dto.channel,
				},
				include: {
					users: true,
				}
			})
			if (!channel)
				throw new HttpException('This channel does not exists', HttpStatus.BAD_REQUEST)
			const invited: ChannelUser = channel.users.find(toFind => toFind.userId === user.id);
			if (invited)
			{
				if (invited.banned)
					throw new HttpException('This user is banned form this channel', HttpStatus.BAD_REQUEST)
				if (invited.invited)
					throw new HttpException('This user is already invited in this channel', HttpStatus.BAD_REQUEST)
				else
					throw new HttpException('This user is already in this channel', HttpStatus.BAD_REQUEST)
			}
			await this.prisma.channelUser.create({
				data:{
					channelId: channel.id,
					userId: user.id,
					invited: true,
				}
			})
			return;
		} catch (error) {
			if (error instanceof HttpException)
				throw error;
			else if (error instanceof PrismaClientKnownRequestError)
				throw new HttpException(`Prisma error : ${error.code}`, HttpStatus.INTERNAL_SERVER_ERROR);
			throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async createPrivateMessage(user: string, userId: number, target: string){
		let channelName: string;
		if (user.toLowerCase() < target.toLowerCase())
			channelName = `${user}_${target}`
		else
			channelName = `${target}_${user}`
		try {
			const channel = await this.prisma.channel.findUnique({
				where:{
					name: channelName
				}
			})
			if (!channel){
				const channel = await this.prisma.channel.create({
					data: {
						name: channelName,
						direct: true,
						private: true,
					}
				})
				const user = await this.prisma.user.findUnique({
					where:{
						name: target,
					}
				})
				if (!user)
					throw new Error('Private message target does not exists');
				const privateMessage = await this.prisma.channelUser.createMany({
					data: [
						{channelId: channel.id, userId: userId},
						{channelId: channel.id, userId: user.id},
					],
				})
				return channelName
			}
			return channelName
		}
		catch (error){
			throw error
		}
	}

	async createMessage(message: MessageDto) {
		try {
			const channel = await this.prisma.channel.findUnique({
				where: {
					name: message.target
				}
			})
			const user = await this.prisma.channelUser.findUnique({
				where: {
					channelId_userId: {
						channelId: channel.id,
						userId: message.userId,
					}
				}
			})
			if (!channel || !user)
				throw new Error('Bad request')
			if (user.muted || user.banned || user.invited)
				throw new Error('You can not talk in this channel')
			const newMessage = await this.prisma.message.create({
				data: {
					channelName: message.target,
					content: message.message,
					sentByName: message.userName,
				}
			})
			return newMessage
		} catch (error) {
			throw error
		}
	}

	async checkAuthorization(cmd : ChannelCmdDto) {
		try {
			if (cmd.userId === cmd.targetId)
				throw new Error('You can not target yourself.')
			const channel = await this.prisma.channel.findUnique({
				where: {
					name: cmd.channel,
				}
			})
			if (!channel)
				throw new Error('Bad Request')
			const user = await this.prisma.channelUser.findUnique({
				where: {
					channelId_userId:
					{
						userId: Number(cmd.userId),
						channelId: channel.id
					}
				}
			})
			if (!user || (!user.admin && !user.owner))
				throw new Error('Not authorized to do it.')
			const target = await this.prisma.channelUser.findUnique({
				where: {
					channelId_userId: {
						userId: Number(cmd.targetId),
						channelId: channel.id,
					}
				}
			})
			if (!target || target.owner)
				throw new Error ('Can not target channel owner.')
			return channel
		} catch (error) {
			throw error
		}
	}

	async kickUser(cmd: ChannelCmdDto) {
		try {
			if (cmd.targetId === cmd.userId)
				throw new Error('You can not kick or ban yourself.')
			const channel = await this.prisma.channel.findUnique({
				where: {
					name: cmd.channel,
				}
			})
			const user = await this.prisma.channelUser.findUnique({
				where: {
					channelId_userId: {
						userId: Number(cmd.userId),
						channelId: channel.id,
					}
				}
			})
			const target = await this.prisma.channelUser.findUnique({
				where: {
					channelId_userId: {
						userId: Number(cmd.targetId),
						channelId: channel.id,
					}
				}
			})
			if (!channel || !user || !target)
				throw new Error('Bad request')
			if (!user.admin && !user.owner)
				throw new Error('You are not authorized to do this.')
			if (user.admin && (target.owner || target.admin || target.invited || target.banned))
				throw new Error('You can not kick or ban this target.')
			const deletedUser = await this.prisma.channelUser.delete({
				where: {
					channelId_userId: {
						userId: Number(cmd.targetId),
						channelId: channel.id,
					}
				}
			})
			return deletedUser
		} catch (error) {
			throw error
		}
	}

	async banUser(cmd: ChannelCmdDto) {
		try {
			const kickedUser = await this.kickUser(cmd)
			const bannedUser = await this.prisma.channelUser.create({
				data: {
					channelId: kickedUser.channelId,
					userId: kickedUser.userId,
					banned: true,					
				}
			})
			return bannedUser			
		} catch (error) {
			throw error
		}
	}

	async unbanUser(cmd: ChannelCmdDto) {
		try {
			const channel = await this.checkAuthorization(cmd)
			const unbanUser = await this.prisma.channelUser.update({
				where: {
					channelId_userId:
					{
						userId: Number(cmd.targetId),
						channelId: channel.id
					}
				},
				data: {
					banned: false,
					member: true,
				}
			})
			return unbanUser
		} catch (error) {
			throw error
		}
	}

	async setAdmin(cmd: ChannelCmdDto) {
		try {
			const channel = await this.checkAuthorization(cmd)
			const newAdmin = await this.prisma.channelUser.update({
				where: {
					channelId_userId:{
						userId: Number(cmd.targetId),
						channelId: channel.id,
					}
				},
				data: {
					owner: false,
					admin: true,
					member: false,
					muted: false,
					banned: false,
					invited: false,
				}
			})
			return newAdmin
		} catch (error) {
			throw error
		}
	}

	async setMember(cmd: ChannelCmdDto) {
		try {
			const channel = await this.checkAuthorization(cmd)
			const newMember = await this.prisma.channelUser.update({
				where: {
					channelId_userId:{
						userId: Number(cmd.targetId),
						channelId: channel.id,
					}
				},
				data: {
					owner: false,
					admin: false,
					member: true,
					muted: false,
					banned: false,
					invited: false,
				}
			})
			return newMember
		} catch (error) {
			throw error
		}
	}

	async muteUser(cmd: ChannelCmdDto) {
		try {
			const channel = await this.checkAuthorization(cmd)
			const muted = await this.prisma.channelUser.update({
				where: {
					channelId_userId:{
						userId: Number(cmd.targetId),
						channelId: channel.id,
					}
				},
				data: {
					member: false,
					muted: true,
				}
			})
			return muted
		} catch (error) {
			throw error
		}
	}

	async unmuteUser(cmd: ChannelCmdDto) {
		try {
			const channel = await this.checkAuthorization(cmd)
			const unmuted = await this.prisma.channelUser.update({
				where: {
					channelId_userId:{
						userId: Number(cmd.targetId),
						channelId: channel.id,
					}
				},
				data: {
					member: true,
					muted: false,
				}
			})
			return unmuted
		} catch (error) {
			throw error
		}
	}

}	
