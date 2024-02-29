import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { ChannelList, UserInChannel } from './chat.types';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { NewChannelDto, JoinChannelDto, ChannelCmdDto, NewPasswordDto } from './dto';
import { ChatService } from './chat.service';
import { Message } from '@prisma/client';
import { InviteChannelDto } from './dto/inviteChannel.dto';

@Controller('chat')
export class ChatController {
	constructor(private chatService: ChatService) {}

	@UseGuards(AuthGuard)
	@Post('add')
	async addChannel(
		@Req() req: Request,
		@Body() dto: NewChannelDto,
	): Promise<string> {
		return await this.chatService.createChannel(req['userID'], dto);
	}

	@UseGuards(AuthGuard)
	@Post('join')
	async joinChannel(
		@Req() req: Request,
		@Body() dto: JoinChannelDto,
	): Promise<void> {
		return await this.chatService.joinChannel(req['userID'], dto);
	}

	@UseGuards(AuthGuard)
	@Get('channel/all')
	async getAllChannels(@Req() req: Request): Promise<ChannelList[]> {
		return await this.chatService.getChannels(req['userID']);
	}

	@UseGuards(AuthGuard)
	@Get('channel/users/:name')
	async getChannelUsers(
		@Param('name') name: string,
	): Promise<UserInChannel[]> {
		return await this.chatService.getChannelUsers(name);
	}

	@UseGuards(AuthGuard)
	@Get('channel/messages/:name')
	async getChannelMessages(@Param('name') name: string): Promise<Message[]> {
		return await this.chatService.getMessages(name);
	}

	@UseGuards(AuthGuard)
	@Patch('channel/invite')
	async inviteToChannel(
		@Req() req: Request,
		@Body() dto: InviteChannelDto,
	): Promise<string> {
		return await this.chatService.inviteUser(req['userID'], dto);
	}

	@UseGuards(AuthGuard)
	@Patch('channel/block')
	async blockUser(@Body() dto: ChannelCmdDto) {
		return await this.chatService.blockUser(dto);
	}

	@UseGuards(AuthGuard)
	@Patch('channel/unblock')
	async unblockUser(@Body() dto: ChannelCmdDto) {
		return await this.chatService.unblockUser(dto);
	}

	@UseGuards(AuthGuard)
	@Patch('channel/password')
	async updatePassword(@Body() dto: NewPasswordDto) {
		return await this.chatService.changePassword(dto)
	}
}
