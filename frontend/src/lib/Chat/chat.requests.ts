import axios from "axios";
import { Channel, CmdData, CreateFormValues, JoinFormValues, Message, UserInChannel } from "./chat.types";
import { Dispatch, SetStateAction } from "react";
import { WebSocketContextType } from "@/context/webSocketContext";

export async function getChannels(): Promise<Channel[]> {
	try {
		const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/chat/channel/all`,{
			withCredentials: true,
		})
		return response.data
	} catch (error) {
		throw error
	}
};

export async function createChannel(
    data: CreateFormValues,
    setErrorMessage: Dispatch<SetStateAction<string>>,
    onClose: () => void
) : Promise<void> {
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
) : Promise<void> {
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
		if (!name)
			throw new Error()
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
		if (!name)
			throw new Error()
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