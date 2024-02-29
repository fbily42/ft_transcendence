import { GameStats, imageForGame } from '@/lib/Game/Game.types'
import { BallObj, PaddleObj } from './data'
import { WebSocketContextType } from '@/context/webSocketContext'

export function BallMovement(
    ctx: CanvasRenderingContext2D,
    gameInfo: GameStats,
    gameImages: imageForGame
) {
    if (gameImages.image.img_fish.complete) {
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
    // // ctx.arc(gameInfo.ball.x, gameInfo.ball.y , gameInfo.ball.rad, 0, 2 * Math.PI);
    // ctx.fillStyle = 'red'
    // ctx.strokeStyle = 'black'
    // ctx.lineWidth = 1
    // ctx?.fill()
    // ctx.stroke()

    // socket.webSocket?.emit('ballMov', room)
}

export function Paddle_Collision(
    gameInfo: GameStats,
    paddle: PaddleObj,
    socket: WebSocketContextType,
    room: string
) {
    // socket.webSocket?.emit('paddllColl', room)
}

export function updatescore(
    gameImages: imageForGame,
    gameInfo: GameStats,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
) {
    ctx.font = '40px Arial'
    ctx.fillStyle = '#45A0E3'
    if (gameImages.image.img_pingu_score.complete) {
        ctx.drawImage(
            gameImages.image.img_pingu_score,
            canvas.width / 4 - (canvas.width / canvas.width) * 45,
            (canvas.height / canvas.height) * 7.5,
            (canvas.width / canvas.width) * 41,
            (canvas.height / canvas.height) * 41
        )
    } else {
        gameImages.image.img_pingu_score.onload = function () {
            ctx.drawImage(
                gameImages.image.img_pingu_score,
                canvas.width / 4 - (canvas.width / canvas.width) * 45,
                (canvas.height / canvas.height) * 7.5,
                (canvas.width / canvas.width) * 41,
                (canvas.height / canvas.height) * 41
            )
        }
    }
    if (gameImages.image.img_grey_score.complete) {
        ctx.drawImage(
            gameImages.image.img_grey_score,
            (3 * canvas.width) / 4 - (canvas.width / canvas.width) * 45,
            (canvas.height / canvas.height) * 7.5,
            (canvas.width / canvas.width) * 41,
            (canvas.height / canvas.height) * 41
        )
    } else {
        gameImages.image.img_grey_score.onload = function () {
            ctx.drawImage(
                gameImages.image.img_grey_score,
                (3 * canvas.width) / 4 - (canvas.width / canvas.width) * 45,
                (canvas.height / canvas.height) * 7.5,
                (canvas.width / canvas.width) * 41,
                (canvas.height / canvas.height) * 41
            )
        }
    }
    ctx.fillText(
        `${gameInfo.gameStatus.scoreTwo}`,
        canvas.width / 4,
        40,
        canvas.width / 5
    )
    ctx.fillText(
        `${gameInfo.gameStatus.scoreOne}`,
        (3 * canvas.width) / 4,
        40,
        canvas.width / 5
    )
}

export function WallCollision(
    gameInfo: GameStats,
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

