import axios from 'axios'
import {
    Channel,
    CmdData,
    CreateFormValues,
    JoinFormValues,
    LeaveChannelData,
    Message,
    UserInChannel,
} from './chat.types'
import { Dispatch, SetStateAction } from 'react'
import { WebSocketContextType } from '@/context/webSocketContext'
import { QueryClient } from '@tanstack/react-query'

export async function getChannels(): Promise<Channel[]> {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/chat/channel/all`,
            {
                withCredentials: true,
            }
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export async function createChannel(
    data: CreateFormValues,
    setErrorMessage: Dispatch<SetStateAction<string>>,
    onClose: () => void
): Promise<void> {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/chat/add`,
            data,
            {
                withCredentials: true,
            }
        )
        onClose()
    } catch (error: any) {
        setErrorMessage(error.response.data.message)
        throw error
    }
}

export async function joinChannel(
    data: JoinFormValues,
    setErrorMessage: Dispatch<SetStateAction<string>>,
    onClose: () => void
): Promise<void> {
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/chat/join`,
            data,
            {
                withCredentials: true,
            }
        )
        onClose()
    } catch (error: any) {
        setErrorMessage(error.response.data.message)
        throw error
    }
}

export async function getChannelUsers(name: string): Promise<UserInChannel[]> {
    try {
        if (!name) throw new Error('No channel name')
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/chat/channel/users/${name}`,
            {
                withCredentials: true,
            }
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export async function getMessages(name: string): Promise<Message[]> {
    try {
        if (!name) throw new Error('No channel name')
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/chat/channel/messages/${name}`,
            {
                withCredentials: true,
            }
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export function kick(data: CmdData, socket: WebSocketContextType) {
    socket?.webSocket?.emit('channelKick', data)
}

export function ban(data: CmdData, socket: WebSocketContextType) {
    socket?.webSocket?.emit('channelBan', data)
}

export function unban(data: CmdData, socket: WebSocketContextType) {
    socket?.webSocket?.emit('channelUnban', data)
}

export function setAdmin(data: CmdData, socket: WebSocketContextType) {
    socket?.webSocket?.emit('channelSetAdmin', data)
}

export function setMember(data: CmdData, socket: WebSocketContextType) {
    socket?.webSocket?.emit('channelSetMember', data)
}

export function mute(data: CmdData, socket: WebSocketContextType) {
    socket?.webSocket?.emit('channelMute', data)
}

export function unmute(data: CmdData, socket: WebSocketContextType) {
    socket?.webSocket?.emit('channelUnmute', data)
}

export function leaveChannel(
    cmd: LeaveChannelData,
    socket: WebSocketContextType
) {
    socket?.webSocket?.emit('quitChannel', cmd)
}

export function directMessage(name: string, socket: WebSocketContextType) {
    socket.webSocket?.emit('privateMessage', name)
}

export async function block(cmd: CmdData, queryClient: QueryClient) {
    try {
        const response = await axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/chat/channel/block`,
            cmd,
            {
                withCredentials: true,
            }
        )
        queryClient.invalidateQueries({ queryKey: ['me'] })
        return response.data
    } catch (error) {
        throw error
    }
}

export async function unblock(cmd: CmdData, queryClient: QueryClient) {
    try {
        const response = await axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/chat/channel/unblock`,
            cmd,
            {
                withCredentials: true,
            }
        )
        queryClient.invalidateQueries({ queryKey: ['me'] })
        return response.data
    } catch (error) {
        throw error
    }
}
