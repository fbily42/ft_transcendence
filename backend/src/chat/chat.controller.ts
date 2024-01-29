import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ChannelName, UserInChannel } from './chat.types';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { NewChannelDto, JoinChannelDto } from './dto';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
	constructor(private chatService: ChatService) {}

	@UseGuards(AuthGuard)
	@Post('add')
	async addChannel(@Req() req: Request, @Body() dto: NewChannelDto): Promise<string> {
		return await this.chatService.createChannel(req['userID'], dto);
	}

	@UseGuards(AuthGuard)
	@Post('join')
	async joinChannel(@Req() req: Request, @Body() dto: JoinChannelDto): Promise<void> {
		return await this.chatService.joinChannel(req['userID'], dto);
	}

	@UseGuards(AuthGuard)
	@Get('channel/all')
	async getAllChannels(@Req() req: Request): Promise<ChannelName[]> {
		return await this.chatService.getChannels(req['userID']);
	}

	@UseGuards(AuthGuard)
	@Get('channel/users/:name')
	async getChannelUsers(@Param('name') name: string): Promise<UserInChannel[]> {
		return await this.chatService.getChannelUsers(name);
	}
}
