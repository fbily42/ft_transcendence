import axios from "axios";

type UserData = {
	name: string;
	score: number;
    rank: number
    games: number
    wins: number
}

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
		console.log('Error getdata', error)
	}
}

export async function getLeaderboard() {
    const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/leaderboard`,
        {
            withCredentials: true,
        }
    )
    if (response.status !== 200) {
        throw new Error(response.statusText)
    }
    return response.data
}