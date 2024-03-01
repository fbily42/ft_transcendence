import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js';
import * as argon from 'argon2';
import {
	ChannelCmdDto,
	JoinChannelDto,
	MessageDto,
	NewChannelDto,
	NewPasswordDto,
} from './dto';
import { Channel, ChannelUser, Message, User } from '@prisma/client';
import { ChannelList, ChannelWithRelation, UserInChannel } from './chat.types';
import { InviteChannelDto } from './dto/inviteChannel.dto';
import { quitCmdDto } from './dto/quitCmd.dto';
import { GameStats, RoomInfo } from 'src/game/Game.types';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChatService {
	constructor(private prisma: PrismaService, private userService: UserService) {}

	async createChannel(userId: string, dto: NewChannelDto): Promise<string> {
		try {
			let hash: string = null;
			if (dto.password) hash = await argon.hash(dto.password);
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
				},
			});
			this.userService.addBadge(userId, 'FIRST_CHANNEL')
			return channel.name;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new HttpException(
						'Channel already exists',
						HttpStatus.CONFLICT,
					);
				} else {
					throw new HttpException(
						`Prisma error : ${error.code}`,
						HttpStatus.INTERNAL_SERVER_ERROR,
					);
				}
			}
			throw new HttpException(
				'Internal server error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async joinChannel(userId: string, dto: JoinChannelDto): Promise<void> {
		try {
			const channel: ChannelWithRelation =
				await this.prisma.channel.findUnique({
					where: {
						name: dto.name,
					},
					include: {
						users: true,
					},
				});
			if (!channel)
				throw new HttpException(
					'Channel does not exists',
					HttpStatus.BAD_REQUEST,
				);
			if (channel.hash) {
				if (
					!dto.password ||
					!(await argon.verify(channel.hash, dto.password))
				) {
					throw new HttpException(
						'Wrong password',
						HttpStatus.BAD_REQUEST,
					);
				}
			}
			const user: ChannelUser = channel.users.find(
				(user) => user.userId === userId,
			);
			if (channel.private && !user)
				throw new HttpException(
					'This is a private channel',
					HttpStatus.BAD_REQUEST,
				);
			if (user) {
				if (user.owner || user.member || user.muted || user.admin)
					throw new HttpException(
						'Channel already joined',
						HttpStatus.CONFLICT,
					);
				if (user.banned)
					throw new HttpException(
						'You are banned from this channel',
						HttpStatus.BAD_REQUEST,
					);
				if (channel.private && !user.invited)
					throw new HttpException(
						'This is a private channel',
						HttpStatus.BAD_REQUEST,
					);
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
					},
				});
				return;
			}
			await this.prisma.channelUser.create({
				data: {
					userId: userId,
					channelId: channel.id,
					member: true,
				},
			});
			return;
		} catch (error) {
			if (error instanceof HttpException) throw error;
			else if (error instanceof PrismaClientKnownRequestError)
				throw new HttpException(
					`Prisma error : ${error.code}`,
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			throw new HttpException(
				'Internal server error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async getChannels(userId: string): Promise<ChannelList[]> {
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
						},
					},
				},
			});

			const channelList: ChannelList[] = channels.map((channel) => {
				const user = channel.users.find(
					(user) => user.userId === userId,
				);
				return {
					name: channel.name,
					direct: channel.direct,
					invited: user?.invited,
					banned: user?.banned,
				};
			});
			return channelList;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError)
				throw new HttpException(
					`Prisma error : ${error.code}`,
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			throw new HttpException(
				'Internal server error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
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
								},
							},
							userId: true,
							owner: true,
							admin: true,
							member: true,
							banned: true,
							muted: true,
							invited: true,
						},
					},
				},
			});
			if (!channel) return;
			// Extract and structure the data
			const users: UserInChannel[] = channel.users.map((channelUser) => ({
				userId: channelUser.userId,
				name: channelUser.user.name,
				pseudo: channelUser.user.pseudo,
				avatar: channelUser.user.avatar,
				owner: channelUser.owner,
				admin: channelUser.admin,
				member: channelUser.member,
				banned: channelUser.banned,
				muted: channelUser.muted,
				invited: channelUser.invited,
			}));
			return users;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError)
				throw new HttpException(
					`Prisma error : ${error.code}`,
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			throw new HttpException(
				'Internal server error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async getMessages(name: string): Promise<Message[]> {
		try {
			const messages: Message[] = await this.prisma.message.findMany({
				where: {
					channelName: name,
				},
			});
			return messages;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError)
				throw new HttpException(
					`Prisma error : ${error.code}`,
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			throw new HttpException(
				'Internal server error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async inviteUser(userId: string, dto: InviteChannelDto) {
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					pseudo: dto.name,
				},
				select:{
					id:true,
					name:true,
				}
			});
			if (!user)
				throw new HttpException(
					'This user does not exists',
					HttpStatus.BAD_REQUEST,
				);
			const channel: ChannelWithRelation =
				await this.prisma.channel.findUnique({
					where: {
						name: dto.channel,
					},
					include: {
						users: true,
					},
				});
			if (!channel)
				throw new HttpException(
					'This channel does not exists',
					HttpStatus.BAD_REQUEST,
				);
			const invited: ChannelUser = channel.users.find(
				(toFind) => toFind.userId === user.id,
			);
			if (invited) {
				if (invited.banned)
					throw new HttpException(
						'This user is banned form this channel',
						HttpStatus.BAD_REQUEST,
					);
				if (invited.invited)
					throw new HttpException(
						'This user is already invited in this channel',
						HttpStatus.BAD_REQUEST,
					);
				else
					throw new HttpException(
						'This user is already in this channel',
						HttpStatus.BAD_REQUEST,
					);
			}
			await this.prisma.channelUser.create({
				data: {
					channelId: channel.id,
					userId: user.id,
					invited: true,
				},
			});
			return user.name;
		} catch (error) {
			if (error instanceof HttpException) throw error;
			else if (error instanceof PrismaClientKnownRequestError)
				throw new HttpException(
					`Prisma error : ${error.code}`,
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			throw new HttpException(
				'Internal server error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async createPrivateMessage(user: string, userId: string, target: string) {
		let channelName: string;
		if (user.toLowerCase() < target.toLowerCase())
			channelName = `${user}_${target}`;
		else channelName = `${target}_${user}`;
		try {
			const channel = await this.prisma.channel.findUnique({
				where: {
					name: channelName,
				},
			});
			if (!channel) {
				const channel = await this.prisma.channel.create({
					data: {
						name: channelName,
						direct: true,
						private: true,
					},
				});
				const user = await this.prisma.user.findUnique({
					where: {
						name: target,
					},
				});
				if (!user)
					throw new Error('Private message target does not exists');
				const privateMessage = await this.prisma.channelUser.createMany(
					{
						data: [
							{
								channelId: channel.id,
								userId: userId,
								member: true,
							},
							{
								channelId: channel.id,
								userId: user.id,
								member: true,
							},
						],
					},
				);
				return channelName;
			}
			return channelName;
		} catch (error) {
			throw error;
		}
	}

	async createMessage(message: MessageDto) {
		try {
			const channel = await this.prisma.channel.findUnique({
				where: {
					name: message.target,
				},
			});
			const user = await this.prisma.channelUser.findUnique({
				where: {
					channelId_userId: {
						channelId: channel.id,
						userId: message.userId,
					},
				},
			});
			if (!channel || !user) throw new Error('Bad request');
			if (user.muted || user.banned || user.invited)
				throw new Error('You can not talk in this channel');
			const newMessage = await this.prisma.message.create({
				data: {
					channelName: message.target,
					content: message.message,
					sentByName: message.userName,
				},
			});
			return newMessage;
		} catch (error) {
			throw error;
		}
	}

	async checkAuthorization(cmd: ChannelCmdDto) {
		try {
			if (cmd.userId === cmd.targetId)
				throw new Error('You can not target yourself.');
			const channel = await this.prisma.channel.findUnique({
				where: {
					name: cmd.channel,
				},
			});
			if (!channel) throw new Error('Bad Request');
			const user = await this.prisma.channelUser.findUnique({
				where: {
					channelId_userId: {
						userId: cmd.userId,
						channelId: channel.id,
					},
				},
			});
			if (!user || (!user.admin && !user.owner))
				throw new Error('Not authorized to do it.');
			const target = await this.prisma.channelUser.findUnique({
				where: {
					channelId_userId: {
						userId: cmd.targetId,
						channelId: channel.id,
					},
				},
			});
			if (!target || target.owner)
				throw new Error('Can not target channel owner.');
			return channel;
		} catch (error) {
			throw error;
		}
	}

	async kickUser(cmd: ChannelCmdDto) {
		try {
			if (cmd.targetId === cmd.userId)
				throw new Error('You can not kick or ban yourself.');
			const channel = await this.prisma.channel.findUnique({
				where: {
					name: cmd.channel,
				},
			});
			const user = await this.prisma.channelUser.findUnique({
				where: {
					channelId_userId: {
						userId: cmd.userId,
						channelId: channel.id,
					},
				},
			});
			const target = await this.prisma.channelUser.findUnique({
				where: {
					channelId_userId: {
						userId: cmd.targetId,
						channelId: channel.id,
					},
				},
			});
			if (!channel || !user || !target) throw new Error('Bad request');
			if (!user.admin && !user.owner)
				throw new Error('You are not authorized to do this.');
			if (
				user.admin &&
				(target.owner ||
					target.admin ||
					target.invited ||
					target.banned)
			)
				throw new Error('You can not kick or ban this target.');
			const deletedUser = await this.prisma.channelUser.delete({
				where: {
					channelId_userId: {
						userId: cmd.targetId,
						channelId: channel.id,
					},
				},
			});
			return deletedUser;
		} catch (error) {
			throw error;
		}
	}

	async banUser(cmd: ChannelCmdDto) {
		try {
			const kickedUser = await this.kickUser(cmd);
			const bannedUser = await this.prisma.channelUser.create({
				data: {
					channelId: kickedUser.channelId,
					userId: kickedUser.userId,
					banned: true,
				},
			});
			return bannedUser;
		} catch (error) {
			throw error;
		}
	}

	async unbanUser(cmd: ChannelCmdDto) {
		try {
			const channel = await this.checkAuthorization(cmd);
			const unbanUser = await this.prisma.channelUser.update({
				where: {
					channelId_userId: {
						userId: cmd.targetId,
						channelId: channel.id,
					},
				},
				data: {
					banned: false,
					member: true,
				},
			});
			return unbanUser;
		} catch (error) {
			throw error;
		}
	}

	async setAdmin(cmd: ChannelCmdDto) {
		try {
			const channel = await this.checkAuthorization(cmd);
			const newAdmin = await this.prisma.channelUser.update({
				where: {
					channelId_userId: {
						userId: cmd.targetId,
						channelId: channel.id,
					},
				},
				data: {
					owner: false,
					admin: true,
					member: false,
					muted: false,
					banned: false,
					invited: false,
				},
			});
			return newAdmin;
		} catch (error) {
			throw error;
		}
	}

	async setMember(cmd: ChannelCmdDto) {
		try {
			const channel = await this.checkAuthorization(cmd);
			const newMember = await this.prisma.channelUser.update({
				where: {
					channelId_userId: {
						userId: cmd.targetId,
						channelId: channel.id,
					},
				},
				data: {
					owner: false,
					admin: false,
					member: true,
					muted: false,
					banned: false,
					invited: false,
				},
			});
			return newMember;
		} catch (error) {
			throw error;
		}
	}

	async muteUser(cmd: ChannelCmdDto) {
		try {
			const channel = await this.checkAuthorization(cmd);
			const muted = await this.prisma.channelUser.update({
				where: {
					channelId_userId: {
						userId: cmd.targetId,
						channelId: channel.id,
					},
				},
				data: {
					member: false,
					muted: true,
				},
			});
			return muted;
		} catch (error) {
			throw error;
		}
	}

	async unmuteUser(cmd: ChannelCmdDto) {
		try {
			const channel = await this.checkAuthorization(cmd);
			const unmuted = await this.prisma.channelUser.update({
				where: {
					channelId_userId: {
						userId: cmd.targetId,
						channelId: channel.id,
					},
				},
				data: {
					member: true,
					muted: false,
				},
			});
			return unmuted;
		} catch (error) {
			throw error;
		}
	}

	async leaveChannel(cmd: quitCmdDto) {
		try {
			const channel = await this.prisma.channel.findUnique({
				where: {
					name: cmd.channel,
				},
			});
			const user = await this.prisma.user.findUnique({
				where: {
					name: cmd.user,
				},
			});
			if (!user || !channel) {
				throw new Error('Bad request');
			}
			if (cmd.newOwner) {
				const newOwner = await this.prisma.user.findUnique({
					where: {
						name: cmd.newOwner,
					},
				});
				if (!newOwner) {
					throw new Error('New owner does not exists');
				}
				const newOwnerRelation = await this.prisma.channelUser.update({
					where: {
						channelId_userId: {
							userId: newOwner.id,
							channelId: channel.id,
						},
					},
					data: {
						owner: true,
						admin: false,
						member: false,
						muted: false,
						banned: false,
						invited: false,
					},
				});
			}
			const deleteUser = await this.prisma.channelUser.delete({
				where: {
					channelId_userId: {
						userId: user.id,
						channelId: channel.id,
					},
				},
			});
			return deleteUser;
		} catch (error) {
			throw error;
		}
	}

	async deleteChannel(name: string) {
		try {
			const deletedChannel = await this.prisma.channel.delete({
				where: {
					name: name,
				},
			});
			return deletedChannel;
		} catch (error) {
			throw error;
		}
	}

	async blockUser(cmd: ChannelCmdDto) {
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					id: cmd.userId,
				},
			});
			if (!user)
				throw new HttpException(
					'This user does not exists',
					HttpStatus.BAD_REQUEST,
				);
			if (user.blocked.includes(cmd.targetName)) {
				return;
			} else {
				user.blocked.push(cmd.targetName);
			}
			const updatedUser = await this.prisma.user.update({
				where: {
					id: user.id,
				},
				data: {
					blocked: user.blocked,
				},
				select: {
					id: true,
					name: true,
					blocked: true,
				},
			});
			return updatedUser;
		} catch (error) {
			if (error instanceof HttpException) throw error;
			else if (error instanceof PrismaClientKnownRequestError)
				throw new HttpException(
					`Prisma error : ${error.code}`,
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			throw new HttpException(
				'Internal server error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async unblockUser(cmd: ChannelCmdDto) {
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					id: cmd.userId,
				},
			});
			if (!user)
				throw new HttpException(
					'This user does not exists',
					HttpStatus.BAD_REQUEST,
				);
			if (user.blocked.includes(cmd.targetName)) {
				const unblocked = user.blocked.filter(
					(blocked) => blocked !== cmd.targetName,
				);
				const updateUser = await this.prisma.user.update({
					where: {
						id: user.id,
					},
					data: {
						blocked: unblocked,
					},
					select: {
						id: true,
						name: true,
						blocked: true,
					},
				});
				return updateUser;
			} else {
				throw new HttpException(
					'This user is not blocked',
					HttpStatus.BAD_REQUEST,
				);
			}
		} catch (error) {
			if (error instanceof HttpException) throw error;
			else if (error instanceof PrismaClientKnownRequestError)
				throw new HttpException(
					`Prisma error : ${error.code}`,
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			throw new HttpException(
				'Internal server error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async changePassword(dto: NewPasswordDto) {
		try {
			const channel = await this.prisma.channel.findUnique({
				where: {
					name: dto.channel,
				},
			});
			if (!channel)
				throw new HttpException(
					'Channel does not exists',
					HttpStatus.BAD_REQUEST,
				);
			const user = await this.prisma.channelUser.findUnique({
				where: {
					channelId_userId: {
						userId: dto.userId,
						channelId: channel.id,
					},
				},
			});
			if (!user || !user.owner)
				throw new HttpException(
					'You are not authorized to change the password',
					HttpStatus.BAD_REQUEST,
				);
			const hash = await argon.hash(dto.newPassword)
			const updatedChannel = await this.prisma.channel.update({
				where: {
					id: channel.id,
				},
				data: {
					hash: hash,
				},
				select: {
					name: true,
				}
			})
			return updatedChannel
		} catch (error) {
			if (error instanceof HttpException) throw error;
			else if (error instanceof PrismaClientKnownRequestError)
				throw new HttpException(
					`Prisma error : ${error.code}`,
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			throw new HttpException(
				'Internal server error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async addGameInfo(roomInfo : RoomInfo[], gameStats: GameStats)
	{
		try{
			const game = await this.prisma.game.create({
				data: {
					userName : roomInfo[0].id,
					opponentName: roomInfo[1].id,
					userScore: gameStats.gameStatus.scoreTwo,
					opponentScore: gameStats.gameStatus.scoreOne,
				}
			})
		}
		catch(error)
		{
			if (error instanceof HttpException) throw error;
			else if (error instanceof PrismaClientKnownRequestError)
				throw new HttpException(
					`Prisma error : ${error.code}`,
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			throw new HttpException(
				'Internal server error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async updateUserStat(roomInfo : RoomInfo[], gameStats : GameStats)
	{
		try{
			const winner = await this.prisma.user.findUnique({
				where: {
						name: gameStats.gameStatus.winner,
				}
			})
			const looser = await this.prisma.user.findUnique({
				where: {
						name: gameStats.gameStatus.looser,
				}
			})

			winner.games += 1;
			winner.wins += 1;
			winner.score += 10;
			looser.games += 1;
			looser.looses += 1;
			if (gameStats.gameStatus.scoreOne < gameStats.gameStatus.scoreTwo)
				looser.score += gameStats.gameStatus.scoreOne;
			else
				looser.score += gameStats.gameStatus.scoreTwo;

			await this.prisma.user.update({
				where:  {
					id: winner.id,
				},
				data:
				{
					games: winner.games,
					wins: winner.wins,
					score: winner.score,

				}
			})
			await this.prisma.user.update({
				where:  {
					id: looser.id,
				},
				data:
				{
					games: looser.games,
					looses: looser.looses,
					score: looser.score,
					
				}
			})
			await this.updateRank()
		}
		catch(error)
		{
			if (error instanceof HttpException) throw error;
			else if (error instanceof PrismaClientKnownRequestError)
				throw new HttpException(
					`Prisma error : ${error.code}`,
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			throw new HttpException(
				'Internal server error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async updateRank() {
		try {
			const users = await this.prisma.user.findMany({
				orderBy: {
					score: 'desc',
				}
			})
			const updates = users.map((user, index) => {
				return this.prisma.user.update({
					where: { id: user.id },
					data: { rank: index + 1 },
				});
			});
			await this.prisma.$transaction(updates);
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError)
				throw new HttpException(
					`Prisma error : ${error.code}`,
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			throw new HttpException(
			'Internal server error',
			HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
