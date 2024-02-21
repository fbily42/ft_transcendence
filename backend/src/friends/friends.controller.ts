import { Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { User } from 'src/decorators/user.decorators';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('friends')
export class FriendsController {
	constructor(
		private friendsService: FriendsService,
		){}
	
	@Post('add/:friendId')
	addNewFriend(@User() user,@Param() params: {friendId:string}){
		return this.friendsService.addNewFriend(user.id, params.friendId)
	}

	@Put('accept/:friendId')
	acceptFriendship(@User() user, @Param() params: {friendId: string}){
		return this.friendsService.acceptFriendship(user.id, params.friendId)
	}

	@Delete('remove/:friendId')
	removeFriend(@User() user, @Param() params: {friendId: string}) {
		return this.friendsService.removeFriend(user.id, params.friendId)
	}

	@Get('friend/:userId')
	getFriends(@Param() params: {userId: string}){
		return this.friendsService.getFriends(params.userId)
	}

	@Get('/me')
	getMyFriends(@User() user){
		return this.friendsService.getFriends(user.id)
	}

	@Get('/me/request')
	getMyInvitation(@User() user){
		return this.friendsService.getFriendRequest(user.id)
	}

	@Get('/me/pending')
	getMyPendings(@Param() params: {friendId:string}){
		return this.friendsService.getPendingInvitations(params.friendId)
	}
}
