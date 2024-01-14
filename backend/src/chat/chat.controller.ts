import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { NewChannelDto } from './dto';

@Controller('chat')
export class ChatController {
	constructor(private chatService: ChatService) {}

	@UseGuards(AuthGuard)
	@Post('add')
	addChannel(@Req() req: Request, @Body() dto: NewChannelDto) {
		return this.chatService.createChannel(req['userID'], dto);
	}

}
