export default {
	ballObj: {
		x: 200,
		y: 200,
		dx: 5,
		dy: 5,
		rad: 20,
		speed: 10,

	},
	player_one: {
		name: "first",
		score: 0,
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