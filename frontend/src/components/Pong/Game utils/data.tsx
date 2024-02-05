export default {
	ballObj: {
		x: 200,
		y: 200,
		dx: 5,
		dy: 5,
		rad: 20,
		speed: 1,

	},
	player_one: {
		name: "first",
		score: 0,
	},
	paddle : {
		x: 10,
		y: 20,
		height : 160,
		width : 60,
		color : '#FFA62b',
	},
	
};

export interface BallObj {
	x: number;
	y: number;
	dx: number;
	dy: number;
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