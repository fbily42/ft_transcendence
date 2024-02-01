type UserChannel = {
	id: number
	name: string
	owner: boolean
	admin: boolean
	member: boolean
	muted: boolean
	invited: boolean
}

export type Message = {
	sendAt: Date
	sendBy: number
	content: string
}

export type Channel = {
	name: string
	users?: UserChannel[]
	messages?: Message[]
}
