import { Prisma } from "@prisma/client"

export type ChannelWithRelation = Prisma.ChannelGetPayload<{
	include: {
		users: true,
	}
}>

export type UserInChannel = {
	userId: string,
	name: string,
	pseudo: string,
	avatar: string,
	photo42: string,
	owner: boolean,
	admin: boolean,
	member: boolean,
	banned: boolean,
	muted: boolean,
	invited: boolean,
}

export type ChannelList = {
	name: string
	direct: boolean
	invited: boolean
	banned: boolean
}