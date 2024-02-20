import { GameStat, imageForGame } from '@/lib/Game/Game.types'
import { BallObj, PaddleObj } from './data'
import { WebSocketContextType } from '@/context/webSocketContext'

export function BallMovement(
    ctx: CanvasRenderingContext2D,
    gameInfo: GameStat,
    gameImages: imageForGame,
    socket: WebSocketContextType,
    room: string
) {
    if (gameImages.image.img_fish.complete) {
        // ctx.beginPath()
        ctx.drawImage(
            gameImages.image.img_fish,
            gameInfo.ball.x - gameInfo.ball.rad,
            gameInfo.ball.y - gameInfo.ball.rad,
            gameInfo.ball.rad * 2,
            gameInfo.ball.rad * 2
        )
        // ctx.closePath()
    } else {
        gameImages.image.img_fish.onload = function () {
            // ctx.beginPath()
            ctx.drawImage(
                gameImages.image.img_fish,
                gameInfo.ball.x - gameInfo.ball.rad,
                gameInfo.ball.y - gameInfo.ball.rad,
                gameInfo.ball.rad * 2,
                gameInfo.ball.rad * 2
            )
            // ctx.closePath()
        }
    }
    // ctx.beginPath()
    // // gameImages.image.img_fish.onload = function() {
    // // L'image est maintenant complètement chargée, vous pouvez travailler avec elle.
    // // 	console.log(img.width); // Affiche la largeur de l'image
    // // };
    // ctx.drawImage(
    //     gameImages.image.img_fish,
    //     gameInfo.ball.x - gameInfo.ball.rad,
    //     gameInfo.ball.y - gameInfo.ball.rad,
    //     gameInfo.ball.rad * 2,
    //     gameInfo.ball.rad * 2
    // )
    // // img.onload = () => {
    // // 		ctx.drawImage(img, ballObj.x - ballObj.rad, ballObj.y - ballObj.rad, ballObj.rad * 2, ballObj.rad * 2);

    // // };

    // // ctx.arc(gameInfo.ball.x, gameInfo.ball.y , gameInfo.ball.rad, 0, 2 * Math.PI);
    // ctx.fillStyle = 'red'
    // ctx.strokeStyle = 'black'
    // ctx.lineWidth = 1
    // ctx?.fill()
    // ctx.stroke()

    // socket.webSocket?.emit('ballMov', room)
}

export function Paddle_Collision(
    gameInfo: GameStat,
    paddle: PaddleObj,
    socket: WebSocketContextType,
    room: string
) {
    socket.webSocket?.emit('paddllColl', room)
}

function updatescore(
    gameImages: imageForGame,
    gameInfo: GameStat,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
) {
    ctx.font = '80px Arial'
    ctx.fillStyle = '#45A0E3'
    if (gameImages.image.img_pingu_score.complete) {
        ctx.drawImage(
            gameImages.image.img_pingu_score,
            canvas.width / 4 - (canvas.width / canvas.width) * 90,
            (canvas.height / canvas.height) * 15,
            (canvas.width / canvas.width) * 82,
            (canvas.height / canvas.height) * 82
        )
    } else {
        gameImages.image.img_pingu_score.onload = function () {
            ctx.drawImage(
                gameImages.image.img_pingu_score,
                canvas.width / 4 - (canvas.width / canvas.width) * 90,
                (canvas.height / canvas.height) * 15,
                (canvas.width / canvas.width) * 82,
                (canvas.height / canvas.height) * 82
            )
        }
    }
    if (gameImages.image.img_grey_score.complete) {
        ctx.drawImage(
            gameImages.image.img_grey_score,
            (3 * canvas.width) / 4 - (canvas.width / canvas.width) * 90,
            (canvas.height / canvas.height) * 15,
            (canvas.width / canvas.width) * 82,
            (canvas.height / canvas.height) * 82
        )
    } else {
        gameImages.image.img_grey_score.onload = function () {
            ctx.drawImage(
                gameImages.image.img_grey_score,
                (3 * canvas.width) / 4 - (canvas.width / canvas.width) * 90,
                (canvas.height / canvas.height) * 15,
                (canvas.width / canvas.width) * 82,
                (canvas.height / canvas.height) * 82
            )
        }
    }
    ctx.fillText(
        `${gameInfo.gamestatus.score_2}`,
        canvas.width / 4,
        80,
        canvas.width / 10
    )
    ctx.fillText(`${gameInfo.gamestatus.score_1}`, (3 * canvas.width) / 4, 80)
}

export function WallCollision(
    gameInfo: GameStat,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    gameImages: imageForGame,
    socket: WebSocketContextType,
    room: string
) {
    socket.webSocket?.emit('ballMov', room)

    updatescore(gameImages, gameInfo, ctx, canvas)
    return 0
}

/* 
function ResetBall(gameInfo: GameStat, canvas: HTMLCanvasElement, direction: number) {
    // Réinitialise la position de la balle au centre du terrain
    gameInfo.ball.x = canvas.width / 2;
    gameInfo.ball.y = canvas.height / 2;
	
    // Donne une direction de départ aléatoire en y
    let angle = Math.random() * (Math.PI / 4) - (Math.PI / 8); // -22.5 à 22.5 degrés
	
    // Applique la direction en fonction du joueur qui a marqué
    gameInfo.ball.dx = direction * Math.cos(angle);
    gameInfo.ball.dy =  Math.sin(angle);
	// ctx?.clearRect(0, 0, canvas.width, canvas.height);
}
*/
