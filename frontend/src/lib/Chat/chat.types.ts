import { Dispatch, SetStateAction } from 'react'

export type Channel = {
	name: string
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

export type UserInChannel = {
	userId: number,
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

export type Message = {
    id: number
    sentAt: Date
    sentByName: string
    channelName: string
    content: string
}