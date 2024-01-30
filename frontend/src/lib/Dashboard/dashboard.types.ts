export type FriendData = {
	id: number;
	name: string;
	avatar?: string;
	status: string;
}

export type UserData = {
	name: string;
	score: number;
    rank: number;
    games: number;
    wins: number;
	friends: FriendData[];
}

export type LeaderboardData = {
	photo42: string;
	score: number;
	rank: number;
	name: string;
};