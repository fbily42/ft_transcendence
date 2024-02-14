export class GameStat {
	ball: BallObj;
	paddle_1 : PaddleObj;
	paddle_2 : PaddleObj;


	canvas : {height:number; width :number;};
	scorePlayer1: number;
	scorePlayer2:number;
	gameState: String;
	constructor() {
		this.canvas ={
			height : 1600,
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
		this.scorePlayer1 = 0;
		this.scorePlayer2 = 0;
		this.gameState = 'waiting'; // Autres états possibles : 'playing', 'ended'
	}
  
	// Méthode pour augmenter le score du joueur 1
	increaseScorePlayer1() {
	  this.scorePlayer1++;
	}
  
	// Méthode pour augmenter le score du joueur 2
	increaseScorePlayer2() {
	  this.scorePlayer2++;
	}
  
	// Méthode pour changer l'état du jeu
	setGameState(newState) {
	  this.gameState = newState;
	}
  
	// Méthode pour réinitialiser le jeu
	resetGame() {
	  this.scorePlayer1 = 0;
	  this.scorePlayer2 = 0;
	  this.gameState = 'waiting';
	}
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