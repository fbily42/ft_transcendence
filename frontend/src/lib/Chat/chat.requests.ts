import axios from "axios";
import { Channel } from "./chat.types";

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