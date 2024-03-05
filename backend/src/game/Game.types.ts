export class GameStats {
	ball: BallObj;
	paddleOne : PaddleObj;
	paddleTwo : PaddleObj;
	gameStatus: GameStatus;


	canvas : {height:number; width :number;};

	constructor(private level:string, map:string) {
		this.canvas ={
			height : 800,
			width : 800,
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
			rad: rad,//
			speed: speed,//15
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
			x: 760,
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
  
	// Méthode pour augmenter le score du joueur 1
	ResetBall(direction: number) {

	this.ball.x = this.canvas.width / 2;
    this.ball.y = this.canvas.height / 2;

    // Donne une direction de départ aléatoire en y
    let angle = Math.random() * (Math.PI / 4) - (Math.PI / 8); // -22.5 à 22.5 degrés

    // Applique la direction en fonction du joueur qui a marqué
    this.ball.dx = direction * Math.cos(angle);
    this.ball.dy =  Math.sin(angle);
	//   this.scorePlayer1++;
	}
  
	// Méthode pour augmenter le score du joueur 2
	WallCollision() {
		if (this.ball.y - this.ball.rad <= 0) {
			this.ball.y = this.ball.rad ; // Ajuste la position pour éviter le "collage"
			this.ball.dy *= -1;
		} else if (this.ball.y + this.ball.rad >= this.canvas.height ) {
			this.ball.y = this.canvas.height - this.ball.rad; // Ajuste la position
			this.ball.dy *= -1;
		}
		
		if (this.ball.x - this.ball.rad <= 0) {
		   this.gameStatus.scoreTwo++;
		   if (this.gameStatus.level === 'hard')
		  	 this.ball.speed = 2; // But pour le joueur 1
		//    this.gameStatus.gameState = 'score';
		//    setTimeout(() => {
			this.gameStatus.gameState = 'playing';
			if (this.gameStatus.scoreOne === 10 )
				this.gameStatus.gameState = 'finish'
			this.ResetBall(1);
		// }, 1000);
			
		} else if (this.ball.x + this.ball.rad >= this.canvas.width) {
			if (this.gameStatus.level === 'hard')
				this.ball.speed = 2
			// this.gameStatus.gameState = 'score';
			this.gameStatus.scoreOne++; // But pour le joueur 
			// setTimeout(() => {
				this.gameStatus.gameState = 'playing';
			if(this.gameStatus.scoreTwo === 10)
				this.gameStatus.gameState = 'finish';
			this.ResetBall(-1);
			// }, 1000);
			
		}
	//   this.scorePlayer2++;
	}
  
	// Méthode pour changer l'état du jeu
	PaddleCollision(paddle: PaddleObj) {
		if (this.ball.x + this.ball.rad > paddle.x && this.ball.x - this.ball.rad < paddle.x + paddle.width) {
			// Vérifie si la balle est au niveau de la hauteur de la raquette
			if (this.ball.y + this.ball.rad > paddle.y && this.ball.y - this.ball.rad < paddle.y + paddle.height) {
				if(this.gameStatus.level === 'hard')
					this.ball.speed += 0.5;
				// Calcule le point de collision sur la raquette (de -1 à 1)
				let collidePoint = (this.ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);
	
				
				// Calcule l'angle de rebond en radians, exemple : -45 à 45 degrés pour le haut et le bas de la raquette
				let angleRad = collidePoint * Math.PI/4; // Pi/4 = 45 degrés
				angleRad = Math.round(angleRad * 100) / 100;
				
				// Change la direction de la balle en fonction du côté de la raquette touché
				
			
				this.ball.dx = Math.round(-Math.cos(angleRad) * 100) /100;
				this.ball.dy = Math.round(Math.sin(angleRad) * 100) /100;
			
	
				// Si vous touchez la raquette gauche, inversez la direction en x
				if (paddle.x < this.ball.x) {
					this.ball.dx = -this.ball.dx;
				}
			}
		}
	}
  
	// Méthode pour réinitialiser le jeu
	resetGame() {
	//   this.scorePlayer1 = 0;
	//   this.scorePlayer2 = 0;
	//   this.gameState = 'waiting';
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