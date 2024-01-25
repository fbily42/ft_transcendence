import axios from "axios";
import { UserData } from "./dashboard.types";

export async function getUserMe() {
	try {
		//api call with jwt as authorization
		const response = await axios.get(
			`${import.meta.env.VITE_BACKEND_URL}/user/me`,
			{
				withCredentials: true,
			}
		)

		const user: UserData = {
			name: response.data?.name || '',
			score: response.data?.score || 0,
			rank: response.data?.rank || 0,
			games: response.data?.games || 0,
			wins: response.data?.wins || 0
		}

		return (user)

	} catch (error) {
		throw error
	}
}

export async function getLeaderboard() {
	try {

		const response = await axios.get(
			`${import.meta.env.VITE_BACKEND_URL}/user/leaderboard`,
			{
				withCredentials: true,
			}
		)
		return response.data
	}
	catch(error){
		throw error
	}
}