import { BallObj, PaddleObj } from "./data";



export function BallMovement(ctx: CanvasRenderingContext2D, ballObj: BallObj) {

	ctx.beginPath();
	ctx.arc(ballObj.x, ballObj.y , ballObj.rad, 0, 2 * Math.PI);
	ctx.fillStyle = "red";
	ctx.strokeStyle = "black";
	ctx.lineWidth = 1;
	ctx?.fill();
	ctx.stroke();
	
	
	ballObj.x += ballObj.dx * ballObj.speed;
	ballObj.y += ballObj.dy * ballObj.speed;


}


export function Paddle_Collision(ballObj: BallObj, paddle: PaddleObj)
{
	//collision avec le paddle 
	// if (ballObj.x - ballObj.rad === (paddle.x + paddle.width))
	// {
	// 	if (ballObj.y - ballObj.rad <= paddle.y + paddle.height && ballObj.y + ballObj.rad >= paddle.y)
	// 		ballObj.dx *= -1;
	// 	if (ballObj.y > paddle.y - (paddle.height / 2))
	// 	{
			
	// 		// console.log('je suis entrer 4');

	// 		// let collidePoint = ballObj.x - (paddle.x + paddle.width / 2);

	// 		// collidePoint = collidePoint / (paddle.width / 2);

	// 		// let angle = (collidePoint * Math.PI) / 3;

	// 		// ballObj.dx = ballObj.speed * Math.sin(angle);
	// 		// ballObj.dy = -ballObj.speed * Math.cos(angle);
	// 	}
	// }
	// if (ballObj.x + ballObj.rad === (paddle.x))
	// {
	// 	if (ballObj.y - ballObj.rad <= paddle.y + paddle.height && ballObj.y + ballObj.rad >= paddle.y)
	// 		ballObj.dx *= -1;
	// 	if (ballObj.y > paddle.y - (paddle.height / 2))
	// 	{
	// 		ballObj.dy *= -1;
	// 		// console.log('je suis entrer 4');

	// 		// let collidePoint = ballObj.x - (paddle.x + paddle.width / 2);

	// 		// collidePoint = collidePoint / (paddle.width / 2);

	// 		// let angle = (collidePoint * Math.PI) / 3;

	// 		// ballObj.dx = ballObj.speed * Math.sin(angle);
	// 		// ballObj.dy = -ballObj.speed * Math.cos(angle);
	// 	}
	// }

	if (ballObj.x + ballObj.rad > paddle.x && ballObj.x - ballObj.rad < paddle.x + paddle.width) {
        // Vérifie si la balle est au niveau de la hauteur de la raquette
        if (ballObj.y + ballObj.rad > paddle.y && ballObj.y - ballObj.rad < paddle.y + paddle.height) {
            // Calcule le point de collision sur la raquette (de -1 à 1)
            let collidePoint = (ballObj.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);
            
            // Calcule l'angle de rebond en radians, exemple : -45 à 45 degrés pour le haut et le bas de la raquette
            let angleRad = collidePoint * Math.PI/4; // Pi/4 = 45 degrés
            
            // Change la direction de la balle en fonction du côté de la raquette touché
			console.log('position avant ', ballObj.dx, ballObj.dy)
            ballObj.dx = -Math.cos(angleRad);
            ballObj.dy = Math.sin(angleRad);
			console.log('position after', ballObj.dx, ballObj.dy)

            // Si vous touchez la raquette gauche, inversez la direction en x
            if (paddle.x < ballObj.x) {
                ballObj.dx = -ballObj.dx;
            }
        }
    }


}

function updatescore(Goal_playerone: number, Goal_playertwo: number, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement)
{
	ctx.font = '80px Arial';
	ctx.fillStyle = 'black';
	ctx.fillText( Goal_playerone + '  -  ' + Goal_playertwo , canvas.width / 2 - 150, canvas.height / 2);


}

export function WallCollision(ballObj: BallObj, canvas: HTMLCanvasElement,ctx: CanvasRenderingContext2D, Game_stat)
{

	// Collision avec les murs supérieur et inférieur
    if (ballObj.y - ballObj.rad <= 0) {
        ballObj.y = ballObj.rad; // Ajuste la position pour éviter le "collage"
        ballObj.dy *= -1;
    } else if (ballObj.y + ballObj.rad >= canvas.height) {
        ballObj.y = canvas.height - ballObj.rad; // Ajuste la position
        ballObj.dy *= -1;
    }
	
	if (ballObj.x - ballObj.rad <= 0) {
       Game_stat.score_1++; // But pour le joueur 2

        ResetBall(ballObj, canvas, 1); 
		
    } else if (ballObj.x + ballObj.rad >= canvas.width) {
        Game_stat.score_2++; // But pour le joueur 1
        ResetBall(ballObj, canvas, -1);
		
    }
	updatescore(Game_stat.score_1, Game_stat.score_2, ctx, canvas);
	return (0);
}

function ResetBall(ballObj: BallObj, canvas: HTMLCanvasElement, direction: number) {
    // Réinitialise la position de la balle au centre du terrain
    ballObj.x = canvas.width / 2;
    ballObj.y = canvas.height / 2;

    // Donne une direction de départ aléatoire en y
    let angle = Math.random() * (Math.PI / 4) - (Math.PI / 8); // -22.5 à 22.5 degrés

    // Applique la direction en fonction du joueur qui a marqué
    ballObj.dx = direction * Math.cos(angle);
    ballObj.dy =  Math.sin(angle);
}