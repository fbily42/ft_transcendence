export type FriendData = {
    id: number
    name: string
    avatar?: string
    status: string
}

export type UserData = {
    id: string
    name: string
    score: number
    rank: number
    games: number
    wins: number
    friends: FriendData[]
    photo42: string
    avatar: string
}

export type LeaderboardData = {
    photo42: string
    score: number
    rank: number
    name: string
}
