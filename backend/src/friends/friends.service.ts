import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendData } from './types/friend.types';

@Injectable()
export class FriendsService {
	constructor(
		private prisma:PrismaService,
	) {}

	async getFriends(friendId: string) {
		const friends = await this.prisma.friendShip.findMany({
			where: {
				OR:[
					{
						friendId: friendId
					},{
						userId: friendId
					}
				],
				accepted:true,
			},
			include:{
				user:{
					select:{
						id:true,
						name:true,
						photo42:true,
					}
				},
				friend:{
					select:{
						id:true,
						name:true,
						photo42:true,
					}
				}
			}
		})
		const test = friends.map((friend) => {
			if (friend.friendId === friendId)
				return friend.user;
			return friend.friend;
		})
		return test;
	}

	async getFriendRequest(userId: string) : Promise<FriendData[]> {

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
							}
						},
					}
				}
			}
		})
		const friendRequest: FriendData[] = friends.friends.map(friendData => ({
			id: friendData.userId,
			name: friendData.user.name,
			avatar: friendData.user.avatar,
			accepted: friendData.accepted,
		}))
		return friendRequest
		// const friends = await this.prisma.friendShip.findMany({
		// 	where: {
		// 		OR:[
		// 			{
		// 				friendId: userId
		// 			},{
		// 				userId: userId
		// 			}
		// 		],
		// 		accepted:false,
		// 	},
		// 	include:{
		// 		user:{
		// 			select:{
		// 				id:true,
		// 				name:true,
		// 				photo42:true,
		// 			}
		// 		},
		// 		friend:{
		// 			select:{
		// 				id:true,
		// 				name:true,
		// 				photo42:true,
		// 			}
		// 		}
		// 	}
		// })
		// const test = friends.map((friend) => {
		// 	if (friend.friendId === userId)
		// 		return friend.user;
		// 	return friend.friend;
		// })
		// return test;
	}

	async getPendingInvitations(userId: string) : Promise<FriendData[]> {

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
							}
						},
					}
				}
			}
		})
	
		const sentInvitations: FriendData[] = user.friendship.map(friendData => ({
			id: friendData.friend.id,
			name: friendData.friend.name,
			avatar: friendData.friend.avatar,
			accepted: friendData.accepted,
		}))
	
		return sentInvitations
	}

	async addNewFriend(userId:string, friendId:string) {
		const requestFriend = await this.prisma.friendShip.findUnique({
			where: {
				userId_friendId:{
					userId: userId,
					friendId: friendId
				}
			}
		})
		if (requestFriend){
			throw new HttpException('You have already send invitation', HttpStatus.FORBIDDEN);
		}
		const invitation = await this.prisma.friendShip.findUnique({
			where: {
				userId_friendId:{
					userId: friendId,
					friendId: userId
				}
			}
		})
		if (invitation){
			throw new HttpException('You already have an invitation', HttpStatus.FORBIDDEN);
		}
		const newFriendship = await this.prisma.friendShip.create({
			data: {
				userId: userId,
				friendId: friendId
			}
		})
		return newFriendship;
	}

	async acceptFriendship(userId: string, friendId: string) {
		const friendship = await this.prisma.friendShip.findUnique({
			where: {
				userId_friendId:{
					userId: friendId,
					friendId: userId
				}
			}
		})
		if (!friendship) {
			throw new HttpException('You have no invitation', HttpStatus.FORBIDDEN);
		}

		const acceptFriend = await this.prisma.friendShip.update({
			where: {
				userId_friendId:{
					userId: friendId,
					friendId: userId
				}
			},
			data: {
				accepted: true,
			}
		})
		return acceptFriend
	}

	async removeFriend(userId: string, friendId: string) {
		const myFriendship = await this.prisma.friendShip.findUnique({
			where: {
				userId_friendId:{
					userId: userId,
					friendId: friendId
				}
			}
		})
		if (myFriendship){
			return this.prisma.friendShip.delete({
				where:{
					userId_friendId:{
						userId: userId,
						friendId: friendId
					}
				}
			})
		}
		const otherFriendship = await this.prisma.friendShip.findUnique({
			where: {
				userId_friendId:{
					userId: friendId,
					friendId: userId
				}
			}
		})
		if (otherFriendship){
			return this.prisma.friendShip.delete({
				where:{
					userId_friendId:{
						userId: friendId,
						friendId: userId
					}
				}
			})
		}
		throw new HttpException("Not Found Friendship", HttpStatus.NOT_FOUND);
	}
}
