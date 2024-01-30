import axios from "axios";
import { Channel, CreateFormValues, JoinFormValues, Message, UserInChannel } from "./chat.types";
import { Dispatch, SetStateAction } from "react";

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