import { Prisma } from "@prisma/client"

export type ChannelWithRelation = Prisma.ChannelGetPayload<{
	include: {
		users: true,
	}
}>

export type UserInChannel = {
	userId: number,
	name: string,
	pseudo: string,
	avatar: string,
	photo42: string,
	admin: boolean,
	member: boolean,
	banned: boolean,
	muted: boolean,
	invited: boolean,
}

export type ChannelName = {
	name: string
}