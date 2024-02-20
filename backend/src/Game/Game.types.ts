export class GameStat {
	ball: BallObj;
	paddle_1 : PaddleObj;
	paddle_2 : PaddleObj;
	gamestatus: GameStatus;


	canvas : {height:number; width :number;};
	// scorePlayer1: number;
	// scorePlayer2:number;
	// gameState: String;
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
			speed: 4,//15
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
			int:1,
		}
		// this.scorePlayer1 = 0;
		// this.scorePlayer2 = 0;
		// this.gameState = 'playing'; // Autres états possibles : 'playing', 'ended'
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
		   this.gamestatus.score_1++; // But pour le joueur 1
		//    this.gamestatus.Gamestate = 'score';
		//    setTimeout(() => {
			this.gamestatus.Gamestate = 'playing';
			if (this.gamestatus.score_1 === 10)
				this.gamestatus.Gamestate = 'finish 1'
			this.ResetBall(1);
		// }, 1000);
			
		} else if (this.ball.x + this.ball.rad >= this.canvas.width) {
			// this.gamestatus.Gamestate = 'score';
			this.gamestatus.score_2++; // But pour le joueur 
			// setTimeout(() => {
				this.gamestatus.Gamestate = 'playing';
			if(this.gamestatus.score_2 === 10)
				this.gamestatus.Gamestate = 'finish 2';
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
	score_1: number;
	score_2: number;
	Gamestate: string;
	img: string;
	int:number;
  }