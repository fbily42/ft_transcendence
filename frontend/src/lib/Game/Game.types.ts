export class GameStats {
	ball: BallObj;
	paddleOne : PaddleObj;
	paddleTwo : PaddleObj;
	gameStatus: GameStatus;


	canvas : {height:number; width :number;};

	constructor() {
		this.canvas ={
			height : 800,
			width : 800,
		}
		this.ball = {
			x: 200,
			y: 200,
			dx: 1,
			dy: 1,
			rad: 20,//
			speed: 1,//15
			last : 0,
		}
		this.paddleOne = {
			x: 10,
			y: 20,
			height : 80,
			width : 30,
			color : '#FFA62b',

		}
		this.paddleTwo ={
			x: 760,
			y: 20,
			height : 80,
			width : 30,
			color : '#FFA62b',
		}
		this.gameStatus = {
			scoreOne: 0,
			scoreTwo: 0,
			gameState: 'playing',
			img: 'not ready',
			int:1,
			winner:'',
			looser:'',
		}
	}
  }

  export type GameStatus = {
	scoreOne: number;
	scoreTwo: number;
	gameState: string;
	img: string;
	int : number;
	winner:string;
	looser:string;
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


  export class imageForGame {
	image: Image_game;
	constructor() {
		this.image = {
			img_fish: new Image(),
    		img_filet: new Image(),
    		img_grey : new Image(),
    		img_pingu : new Image(),
    		img_pingu_score : new Image(),
    		img_grey_score : new Image(),
    		img_ice : new Image(),
    		img_ice_bottom : new Image(),
		}
	}
  }

  export type Image_game = {
	img_fish : HTMLImageElement;
    img_filet : HTMLImageElement;
    img_grey : HTMLImageElement;
    img_pingu : HTMLImageElement;
    img_pingu_score : HTMLImageElement;
    img_grey_score : HTMLImageElement;
    img_ice : HTMLImageElement;
    img_ice_bottom : HTMLImageElement;
  }