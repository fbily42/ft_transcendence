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

export async function getUsers(): Promise<UserData[]> {
    const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/all`,
        {
            withCredentials: true,
        }
    )
    return response.data
}

export async function getLeaderboard(): Promise<LeaderboardData[]> {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/user/leaderboard`,
            {
                withCredentials: true,
            }
            )
        return response.data
}

export async function getUserById(id: string): Promise<UserData> {
    const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/profile/${id}`,
        {
            withCredentials: true,
        }
    )
    return response.data
}

export async function addNewFriend(friendId: string) {
    const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/friends/add/${friendId}`,
        null,
        {
            withCredentials: true,
        }
    )

    return response.data
}

export async function removeFriend(friendId: string) {
    const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/friends/remove/${friendId}`,
        {
            withCredentials: true,
        }
    )
    return response.data
}

export async function getFriends(friendId: string) {
    const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/friends/friend/${friendId}`,
        {
            withCredentials: true
        }
    )
    return response.data
}

export async function getMyFriends() {
    const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/friends/me`,
        {
            withCredentials: true
        }
    )
    return response.data
}
