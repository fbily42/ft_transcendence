import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { NewChannelDto, JoinChannelDto } from './dto';
import { Channel, ChannelMember } from '@prisma/client';

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
	async joinChannel(@Req() req: Request, @Body() dto: JoinChannelDto): Promise<ChannelMember> {
		return await this.chatService.joinChannel(req['userID'], dto);
	}
}
