import { AchievementType, Badge } from "../Profile/profile.types"

export type FriendData = {
    id: string
    name: string
    pseudo: string
    avatar: string
    accepted: boolean
    status: string
}

export type UserData = {
	id: string;
	name: string;
	score: number;
  rank: number;
  games: number;
  wins: number;
	friends: FriendData[];
	photo42: string;
	avatar: string;
	pseudo: string;
  looses: number;
	blocked: string
  chosenBadge: AchievementType;
  allBadges: AchievementType[];
}

export type LeaderboardData = {
    photo42: string
    score: number
    rank: number
    name: string
    pseudo: string
	  avatar: string;
}
