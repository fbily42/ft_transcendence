import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendsService {
	constructor(
		private prisma:PrismaService,
	) {}

	// Todo: get Friends
	// Todo: get Invitations

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

	async getInvite(friendId: string) {
		const friends = await this.prisma.friendShip.findMany({
			where: {
				OR:[
					{
						friendId: friendId
					},{
						userId: friendId
					}
				],
				accepted:false,
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
