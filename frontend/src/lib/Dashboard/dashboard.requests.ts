import axios from "axios";
import { LeaderboardData, UserData } from "./dashboard.types";

export async function getUserMe():Promise<UserData> {
	try {
		//api call with jwt as authorization
		const response = await axios.get(
			`${import.meta.env.VITE_BACKEND_URL}/user/me`,
			{
				withCredentials: true,
			}
		)
		return response.data
	} catch (error) {
		throw error
	}
}

export async function getLeaderboard(): Promise<LeaderboardData> {
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