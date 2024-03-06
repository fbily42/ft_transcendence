export type GameHistory = {
	createdAt:string,
	user:{
		pseudo:string,
		avatar:string,
	},
	opponent:{
		pseudo:string,
		avatar:string,
	}
	userScore:number,
	opponentScore:number,
}

export type AchievementType = "FIRST_FRIEND" | "FIRST_GAME" | "FIRST_CHANNEL" | "FIRST_WIN"

export type Badge = {
	src: string,
	emptyState: string,
	string: AchievementType,
}

export type BadgeDTO = {
	chosenBadge: AchievementType; 
}