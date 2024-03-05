import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendData } from './types/friend.types';
import { UserService } from 'src/user/user.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class FriendsService {
	constructor(
		private prisma: PrismaService,
		private userService: UserService,
	) {}

	async getFriends(friendId: string) {
		try {
			const friends = await this.prisma.friendShip.findMany({
				where: {
					OR: [
						{
							friendId: friendId,
						},
						{
							userId: friendId,
						},
					],
					accepted: true,
				},
				include: {
					user: {
						select: {
							id: true,
							name: true,
							avatar: true,
							pseudo: true,
						},
					},
					friend: {
						select: {
							id: true,
							name: true,
							avatar: true,
							pseudo: true,
						},
					},
				},
			});
			if (!friends)
				throw new HttpException(
					'No friends founded',
					HttpStatus.BAD_REQUEST,
				);
			const test = friends.map((friend) => {
				if (friend.friendId === friendId) return friend.user;
				return friend.friend;
			});
			return test;
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

	async getFriendRequest(userId: string): Promise<FriendData[]> {
		try {
			const friends = await this.prisma.user.findUnique({
				where: {
					id: userId,
				},
				select: {
					friends: {
						include: {
							user: {
								select: {
									id: true,
									name: true,
									avatar: true,
									pseudo: true,
								},
							},
						},
					},
				},
			});
			if (!friends)
				throw new HttpException(
					'Friend does not exists',
					HttpStatus.BAD_REQUEST,
				);
			const friendRequest: FriendData[] = friends.friends
				.filter((friendData) => !friendData.accepted)
				.map((friendData) => ({
					id: friendData.user.id,
					name: friendData.user.name,
					avatar: friendData.user.avatar,
					pseudo: friendData.user.pseudo,
					accepted: friendData.accepted,
				}));
			return friendRequest;
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

	async getPendingInvitations(userId: string): Promise<FriendData[]> {
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					id: userId,
				},
				select: {
					friendship: {
						include: {
							friend: {
								select: {
									id: true,
									name: true,
									avatar: true,
									pseudo: true,
								},
							},
						},
					},
				},
			});
			if (!user)
				throw new HttpException(
					'Friend does not exists',
					HttpStatus.BAD_REQUEST,
				);

			const sentInvitations: FriendData[] = user.friendship
				.filter((friendData) => !friendData.accepted)
				.map((friendData) => ({
					id: friendData.friend.id,
					name: friendData.friend.name,
					avatar: friendData.friend.avatar,
					pseudo: friendData.friend.pseudo,
					accepted: friendData.accepted,
				}));
			return sentInvitations;
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

	async addNewFriend(userId: string, friendId: string) {
		try {
			const requestFriend = await this.prisma.friendShip.findUnique({
				where: {
					userId_friendId: {
						userId: userId,
						friendId: friendId,
					},
				},
			});
			if (requestFriend) {
				throw new HttpException(
					'You have already send invitation',
					HttpStatus.FORBIDDEN,
				);
			}
			const invitation = await this.prisma.friendShip.findUnique({
				where: {
					userId_friendId: {
						userId: friendId,
						friendId: userId,
					},
				},
			});
			if (invitation) {
				throw new HttpException(
					'You already have an invitation',
					HttpStatus.FORBIDDEN,
				);
			}
			const newFriendship = await this.prisma.friendShip.create({
				data: {
					userId: userId,
					friendId: friendId,
				},
			});
			return newFriendship;
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

	async acceptFriendship(userId: string, friendId: string) {
		try {
			const friendship = await this.prisma.friendShip.findUnique({
				where: {
					userId_friendId: {
						userId: friendId,
						friendId: userId,
					},
				},
			});
			if (!friendship) {
				throw new HttpException(
					'You have no invitation',
					HttpStatus.FORBIDDEN,
				);
			}

			const acceptFriend = await this.prisma.friendShip.update({
				where: {
					userId_friendId: {
						userId: friendId,
						friendId: userId,
					},
				},
				data: {
					accepted: true,
				},
			});

			this.userService.addBadge(userId, 'FIRST_FRIEND');
			this.userService.addBadge(friendId, 'FIRST_FRIEND');

			return acceptFriend;
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

	async removeFriend(userId: string, friendId: string) {
		try {
			const myFriendship = await this.prisma.friendShip.findUnique({
				where: {
					userId_friendId: {
						userId: userId,
						friendId: friendId,
					},
				},
			});
			if (myFriendship) {
				return this.prisma.friendShip.delete({
					where: {
						userId_friendId: {
							userId: userId,
							friendId: friendId,
						},
					},
				});
			}
			const otherFriendship = await this.prisma.friendShip.findUnique({
				where: {
					userId_friendId: {
						userId: friendId,
						friendId: userId,
					},
				},
			});
			if (otherFriendship) {
				return this.prisma.friendShip.delete({
					where: {
						userId_friendId: {
							userId: friendId,
							friendId: userId,
						},
					},
				});
			}
			throw new HttpException(
				'Not Found Friendship',
				HttpStatus.NOT_FOUND,
			);
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
}
