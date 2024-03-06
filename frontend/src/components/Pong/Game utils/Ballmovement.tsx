import { GameStats, imageForGame } from '@/lib/Game/Game.types'
import { BallObj, PaddleObj } from './data'
import { WebSocketContextType } from '@/context/webSocketContext'

export function BallMovement(
    ctx: CanvasRenderingContext2D,
    gameInfo: GameStats,
    gameImages: imageForGame
) {
    if (gameInfo.gameStatus.map === 'mapPingu') {
        if (gameImages.image.img_fish.complete) {
            ctx.drawImage(
                gameImages.image.img_fish,
                gameInfo.ball.x - gameInfo.ball.rad,
                gameInfo.ball.y - gameInfo.ball.rad,
                gameInfo.ball.rad * 2,
                gameInfo.ball.rad * 2
            )
        } else {
            gameImages.image.img_fish.onload = function () {
                ctx.drawImage(
                    gameImages.image.img_fish,
                    gameInfo.ball.x - gameInfo.ball.rad,
                    gameInfo.ball.y - gameInfo.ball.rad,
                    gameInfo.ball.rad * 2,
                    gameInfo.ball.rad * 2
                )

            }
        }
    } else {
        ctx.beginPath()
        ctx.arc(
            gameInfo.ball.x,
            gameInfo.ball.y,
            gameInfo.ball.rad,
            0,
            2 * Math.PI
        )
        ctx.fillStyle = 'red'
        ctx.strokeStyle = 'black'
        ctx.lineWidth = 1
        ctx?.fill()
        ctx.stroke()
    }
}

export function updatescore(
    gameInfo: GameStats,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
) {
    ctx.font = 'bold 60px Fredoka'
    ctx.fillStyle = '#45A0E3'

    ctx.fillText(
        `${gameInfo.gameStatus.scoreOne}`,
        canvas.width / 4,
        60,
        canvas.width / 5
    )
    ctx.fillText(
        `${gameInfo.gameStatus.scoreTwo}`,
        (3 * canvas.width) / 4,
        60,
        canvas.width / 5
    )
}

export function WallCollision(
    gameInfo: GameStats,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    socket: WebSocketContextType,
    room: string
) {
    socket.webSocket?.emit('ballMov', room)

    updatescore(gameInfo, ctx, canvas)
    return 0
}
