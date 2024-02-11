import axios from 'axios'
import { LeaderboardData, UserData } from './dashboard.types'
// import { error } from 'console'

export async function getUserMe(): Promise<UserData> {
    const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/me`,
        {
            withCredentials: true,
        }
    )
    return response.data
}

export async function getOtherUser(pseudo: string): Promise<UserData> {
    const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/${pseudo}`,
        {
            withCredentials: true,
        }
    )
    return response.data
}

export async function getUsers(): Promise<UserData> {
    const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/`,
        {
            withCredentials: true,
        }
    )
    return response.data
}

export async function getLeaderboard(): Promise<LeaderboardData[]> {
    // try {
    const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/leaderboard`,
        {
            withCredentials: true,
        }
    )
    return response.data
    // } catch (error) {
    //     throw error
    // }
}

export async function getUserById(id: string): Promise<UserData> {
    const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/${id}`,
        {
            withCredentials: true,
        }
    )
    return response.data
}
