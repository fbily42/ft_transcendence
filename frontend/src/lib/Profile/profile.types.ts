export type GameHistory={
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