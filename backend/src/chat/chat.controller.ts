import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { NewChannelDto, JoinChannelDto } from './dto';
import { Channel } from '@prisma/client';

@Controller('chat')
export class ChatController {
	constructor(private chatService: ChatService) {}

	@UseGuards(AuthGuard)
	@Post('add')
	async addChannel(@Req() req: Request, @Body() dto: NewChannelDto): Promise<Channel> {
		return await this.chatService.createChannel(req['userID'], dto);
	}

	@UseGuards(AuthGuard)
	@Post('join')
	async joinChannel(@Req() req: Request, @Body() dto: JoinChannelDto): Promise<void> {
		return await this.chatService.joinChannel(req['userID'], dto);
	}

	@UseGuards(AuthGuard)
	@Get('channel/all')
	async getAllChannels(@Req() req: Request): Promise<any> {
		return await this.chatService.getChannels(req['userID']);
	}

	@UseGuards(AuthGuard)
	@Get('channel/users')
	async getChannelUsers(@Body() id: number): Promise<any> {
		return await this.chatService.getChannelUsers(2);
	}
}
