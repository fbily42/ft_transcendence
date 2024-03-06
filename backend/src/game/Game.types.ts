export class GameStats {
	ball: BallObj;
	paddleOne : PaddleObj;
	paddleTwo : PaddleObj;
	gameStatus: GameStatus;


	canvas : {height:number; width :number;};

	constructor(private level:string, map:string) {
		this.canvas ={
			height : 1000,
			width : 1200,
		}
		let width = 30;
		let rad = 20;
		let speed = 2;

		if (map === 'BasicPong')
		{
			width /= 2;
			rad /=2;
			speed = 3;
		}
		this.ball = {
			x: 200,
			y: 200,
			dx: 1,
			dy: 1,
			rad: rad,
			speed: speed,
			last : 0,
		}
		this.paddleOne = {
			x: 10,
			y: 20,
			height : 80,
			width : width,
			color : '#1B1B1B',

		}
		this.paddleTwo ={
			x: this.canvas.width - 40,
			y: 20,
			height : 80,
			width : width,
			color : '#1B1B1B',
		}
		this.gameStatus = {
			scoreOne: 0,
			scoreTwo: 0,
			gameState: 'playing',
			img: 'not ready',
			int:1,
			winner:'',
			looser:'',
			level: level,
			map:map,
		}
	}
  
	ResetBall(direction: number) {

	this.ball.x = this.canvas.width / 2;
    this.ball.y = this.canvas.height / 2;

    let angle = Math.random() * (Math.PI / 4) - (Math.PI / 8); 

    this.ball.dx = direction * Math.cos(angle);
    this.ball.dy =  Math.sin(angle);

	}
  

	WallCollision() {
		if (this.ball.y - this.ball.rad <= 0) {
			this.ball.y = this.ball.rad ;
			this.ball.dy *= -1;
		} else if (this.ball.y + this.ball.rad >= this.canvas.height ) {
			this.ball.y = this.canvas.height - this.ball.rad; 
			this.ball.dy *= -1;
		}
		
		if (this.ball.x - this.ball.rad <= 0) {
		   this.gameStatus.scoreTwo++;
		   if (this.gameStatus.level === 'hard')
		  	 this.ball.speed = 2;

			this.gameStatus.gameState = 'playing';
			if (this.gameStatus.scoreOne === 1 )
				this.gameStatus.gameState = 'finish'
			this.ResetBall(1);

			
		} else if (this.ball.x + this.ball.rad >= this.canvas.width) {
			if (this.gameStatus.level === 'hard')
				this.ball.speed = 2
			this.gameStatus.scoreOne++;
				this.gameStatus.gameState = 'playing';
			if(this.gameStatus.scoreTwo === 11)
				this.gameStatus.gameState = 'finish';
			this.ResetBall(-1);
			
		}
	}
  
	PaddleCollision(paddle: PaddleObj) {
		if (this.ball.x + this.ball.rad > paddle.x && this.ball.x - this.ball.rad < paddle.x + paddle.width) {
			if (this.ball.y + this.ball.rad > paddle.y && this.ball.y - this.ball.rad < paddle.y + paddle.height) {
				if(this.gameStatus.level === 'hard')
					this.ball.speed += 0.5;
				let collidePoint = (this.ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);
				let angleRad = collidePoint * Math.PI/4;
				angleRad = Math.round(angleRad * 100) / 100;

				this.ball.dx = Math.round(-Math.cos(angleRad) * 100) /100;
				this.ball.dy = Math.round(Math.sin(angleRad) * 100) /100;
				if (paddle.x < this.ball.x) {
					this.ball.dx = -this.ball.dx;
				}
			}
		}
	}
  

	resetGame() {
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

  export type GameStatus = {
	scoreOne: number;
	scoreTwo: number;
	gameState: string;
	img: string;
	int:number;
	winner:string;
	looser:string;
	level:string;
	map:string;
  }

export type RoomInfo = {
	id: string;
	websocket: string;
	matchmaking : boolean;
	uuid: string;
}