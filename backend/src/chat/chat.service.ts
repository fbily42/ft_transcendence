import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from "argon2";
import { JoinChannelDto, NewChannelDto } from './dto';
import { Channel, ChannelMember, Prisma } from '@prisma/client';

type ChannelWithRelation = Prisma.ChannelGetPayload<{include: {admins: true, banned: true, members: true, invited: true, muted: true}}>

@Injectable()
export class ChatService {
	constructor(private prisma: PrismaService) {}

	async createChannel(userId: number, dto: NewChannelDto): Promise<Channel> {
		try {
			let hash: string = null;
			if (dto.password)
				hash = await argon.hash(dto.password);
			const channel: Channel = await this.prisma.channel.create({
				data: {
					name: dto.name,
					private: dto.private,
					hash: hash,
					owner: {
						connect: {
							id: userId,
						},
					},
				},
			});
			delete channel.hash;
			return channel;
		} catch(error) {
			if (error instanceof PrismaClientKnownRequestError){
				if (error.code === 'P2002')
					throw new HttpException('Channel already exists', HttpStatus.CONFLICT);
				else
					throw new HttpException(`Prisma error : ${error.code}`, HttpStatus.INTERNAL_SERVER_ERROR);
			}
			throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async joinChannel(userId :number, dto: JoinChannelDto): Promise<any>{
		try {
			const channel: ChannelWithRelation = await this.prisma.channel.findUnique({
				where: {name: dto.name},
				include:{
					owner:true,
					admins: {
						where: {userId: userId}
					},
					members: {
						where: {userId: userId}
					},
					banned: {
						where: {userId: userId}
					},
					muted: {
						where: {userId: userId}
					},
					invited: {
						where: {userId: userId}
					}
				}
			})
			if (!channel)
				throw new HttpException('Channel does not exists', HttpStatus.BAD_REQUEST);
			if (channel.ownerId === userId || channel.members.some(member => member.userId === userId) || channel.muted.some(muted => muted.userId === userId))
				throw new HttpException('Channel already joined', HttpStatus.CONFLICT);
			if (channel.banned.some(banned => banned.userId === userId))
				throw new HttpException('You are banned from this channel', HttpStatus.BAD_REQUEST);
			if (channel.private)
			{
				if (!channel.invited.some(invite => invite.userId === userId))
					throw new HttpException('This is a private channel', HttpStatus.BAD_REQUEST);
			}
			if (channel.hash)
			{
				if (!dto.password || !await argon.verify(channel.hash, dto.password))
					throw new HttpException("Wrong password", HttpStatus.BAD_REQUEST);
			}
			const joined: ChannelMember = await this.prisma.channelMember.create({
				data:{
					userId: userId,
					channelId: channel.id,
				},
			});
			return;
		} catch (error) {
			if (error instanceof HttpException)
				throw error;
			else if (error instanceof PrismaClientKnownRequestError)
				throw new HttpException(`Prisma error : ${error.code}`, HttpStatus.INTERNAL_SERVER_ERROR);
			throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}

/* 

User [

	channelsOwn Channel[]
	channels 	ChannelRelation []
]

Channel [

	owner		User
	members 	ChannelRelation []
]

ChannelRelation [

  channelId 	Int
  channel 		Channel @relation(fields: [channelId], references: [id])

  userId    	Int
  user    		User @relation(fields: [userId], references: [id])

  admins		boolean
  member		boolean
  banned		boolean
  muted			boolean
  invited		boolean

  @@id([channelId, userId])
]

*/