import { Dispatch, SetStateAction } from 'react'

export type Channel = {
	name: string
	direct: boolean
	invited: boolean
	banned: boolean
}

export type CreateFormValues = {
    name: string
    password?: string
    private: boolean
}

export type CreateChannelProps = {
    data: CreateFormValues
    setErrorMessage: Dispatch<SetStateAction<string>>
    onClose: () => void
}

export type JoinFormValues = {
    name: string
    password?: string
}

export type JoinChannelProps = {
	data: JoinFormValues
	setErrorMessage: Dispatch<SetStateAction<string>>
    onClose: () => void
}

export interface CardInviteProps {
    onClose: () => void
    channel: string
}

export type InviteFormValues = {
    sentBy: string
    name: string
    channel: string
}

export type UserInChannel = {
	userId: string,
	name: string,
	pseudo: string,
	avatar: string,
	owner: boolean,
	admin: boolean,
	member: boolean,
	banned: boolean,
	muted: boolean,
	invited: boolean,
}

export type Message = {
    id: number
    sentAt: Date
    sentByName: string
    channelName: string
    content: string
}

export type DropdownChannelUserProps = {
    targetId: string
    targetName: string
    role: string
    targetRole: string
}

export type CmdData = {
    userId: string | undefined
    targetId: string
    targetName: string
    channel: string | null
}

export type DropdownChannelProps = {
    userName: string
    channelName: string
    role: string
}

export type LeaveChannelData = {
    user: string
    channel: string
    role: string
	newOwner?: string
}