export class GameStat {
	ball: BallObj;
	paddle_1 : PaddleObj;
	paddle_2 : PaddleObj;
	gamestatus: GameStatus;


	canvas : {height:number; width :number;};

	constructor() {
		this.canvas ={
			height : 1000,
			width : 1600,
		}
		this.ball = {
			x: 200,
			y: 200,
			dx: 1,
			dy: 1,
			rad: 40,
			speed: 15,
			last : 0,
		}
		this.paddle_1 = {
			x: 10,
			y: 20,
			height : 160,
			width : 60,
			color : '#FFA62b',

		}
		this.paddle_2 ={
			x: 1490,
			y: 20,
			height : 160,
			width : 60,
			color : '#FFA62b',
		}
		this.gamestatus = {
			score_1: 0,
			score_2: 0,
			Gamestate: 'playing',
			img: 'not ready',
		}
	}
  }

  export type GameStatus = {
	score_1: number;
	score_2: number;
	Gamestate: string;
	img: string;
  }
  
  export type BallObj = {
	x: number;
	y: number;
	dx: any;
	dy: any;
	rad: number;
	speed: number;
	last: number;
  }

  export type PaddleObj = {
	x: number;
	y: number;
	height: number;
	width: number;
	color: string;
  }