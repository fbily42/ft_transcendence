import { Dispatch, SetStateAction } from 'react'

export type CreateChannelProps = {
    data: CreateFormValues
    setErrorMessage: Dispatch<SetStateAction<string>>
    onClose: () => void
}

export interface TabsChannelProps {
    onClose: () => void
}

export interface UserListProps {
    channel: string
}

export interface CardCreateProps {
    onClose: () => void
}

export interface CardJoinProps {
    onClose: () => void
}

export type CardPasswordProps = {
    channel: string
    closeDialog: () => void
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

export interface ChannelPanelProps {
    setCurrentChannel: React.Dispatch<React.SetStateAction<string>>
    currentChannel: string
}

export type DropdownChannelUserProps = {
    targetId: string
    targetName: string
    role: string
    targetRole: string
    channel: string
}

export type DropdownChannelProps = {
    userName: string
    channelName: string
    role: string
}

export type LeaveChannelProps = {
    cmd: LeaveChannelData
    variant: 'Owner' | 'Other'
}

export interface MessageBubbleProps {
    pseudo: string
    message: Message
    picture: string
    role: string
    blocked: boolean
}

export interface SelfMessageProps {
    message: Message
    picture: string
    role: string
}

export interface ChatWindowProps {
    currentChannel: string
}

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

export interface CardChannelUserProps {
    targetPseudo: string
    targetId: string
    targetPicture: string
    targetName: string
    targetRole: string
    userRole: string
    channel: string
}

export type JoinFormValues = {
    name: string
    password?: string
}

export type InviteFormValues = {
    sentBy: string
    name: string
    channel: string
}

export type UserInChannel = {
    userId: string
    name: string
    pseudo: string
    avatar: string
    owner: boolean
    admin: boolean
    member: boolean
    banned: boolean
    muted: boolean
    invited: boolean
}

export type CmdData = {
    userId: string | undefined
    targetId: string
    targetName: string
    channel: string | null
}

export type LeaveChannelData = {
    user: string
    channel: string
    role: string
    newOwner?: string
    alone: boolean
}

export type PasswordCmd = {
    userId: string
    channel: string
    newPassword: string
}

export type MessageFormValues = {
    userId: string
    userName: string
    target: string
    message: string
}

export type Message = {
    id: number
    sentAt: Date
    sentByName: string
    channelName: string
    content: string
}
