export default {
	ballObj: {
		x: 200,
		y: 200,
		dx: 1,
		dy: 1,
		rad: 20,
		speed: 10,

	},
	player_one: {
		name: "first",
		score: 0,
	},
	player_two: {
		name: "two",
		score: 0,
	},
	Game_stat:{
		score_1: 0,
		score_2: 0,
	},
	paddle_1 : {
		x: 10,
		y: 20,
		height : 160,
		width : 60,
		color : '#FFA62b',
	},
	paddle_2 : {
		x: 1490,
		y: 20,
		height : 160,
		width : 60,
		color : '#FFA62b',
	},
	
};

export interface BallObj {
	x: number;
	y: number;
	dx: any;
	dy: any;
	rad: number;
	speed: number;
  }

  export interface PaddleObj {
	x: number;
	y: number;
	height: number;
	width: number;
	// rad: number;
	color: string;
  }