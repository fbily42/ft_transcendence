import { WebSocketContextType } from '@/context/webSocketContext'

import { GameStats, imageForGame } from '@/lib/Game/Game.types'



type keyData = {
	key: string,
	roomId: string,
}
export function Paddle_2(
    ctx: CanvasRenderingContext2D,
    gameInfo: GameStats,
    keys: { [key: string]: boolean },
    gameImages: imageForGame,
    socket: WebSocketContextType,
    roomName: string,
) {

    if (keys['ArrowUp']) {
		const data: keyData = {key: 'ArrowUp', roomId: roomName}
        socket?.webSocket?.emit('key', data)}

    else if (keys['ArrowDown']) {
        socket?.webSocket?.emit('key', { key: 'ArrowDown', roomId: roomName })
    }

    ctx.beginPath()
    ctx.drawImage(
        gameImages.image.img_grey,
        gameInfo.paddleTwo.x,
        gameInfo.paddleTwo.y,
        gameInfo.paddleTwo.width,
        gameInfo.paddleTwo.height
    )
    // ctx.rect(gameInfo.paddleTwo.x, gameInfo.paddleTwo.y, gameInfo.paddleTwo.width, gameInfo.paddleTwo.height);
    ctx.fillStyle = gameInfo.paddleTwo.color
    ctx.strokeStyle = gameInfo.paddleTwo.color
    ctx.lineWidth = 1
    ctx.fillStyle = gameInfo.paddleTwo.color
    ctx.shadowBlur = 0
    ctx.shadowColor = 'blue'
    ctx.strokeRect(gameInfo.paddleTwo.x, gameInfo.paddleTwo.y, gameInfo.paddleTwo.width, gameInfo.paddleTwo.height)
    ctx.fill()
}

export function Paddle_1(
    ctx: CanvasRenderingContext2D,
    gameInfo: GameStats,
    keys: { [key: string]: boolean },
    gameImages: imageForGame,
    socket: WebSocketContextType,
    roomName: string,
) {

    if (keys['a']) {
        socket?.webSocket?.emit('key', { key: 'a', roomId: roomName })
    }

    else if (keys['d']) {
        socket?.webSocket?.emit('key', { key: 'd', roomId: roomName })
    }
    ctx.beginPath()
    ctx.drawImage(
        gameImages.image.img_pingu,
        gameInfo.paddleOne.x,
        gameInfo.paddleOne.y,
        gameInfo.paddleOne.width,
        gameInfo.paddleOne.height
    )
    // ctx.rect(gameInfo.paddleOne.x, gameInfo.paddleOne.y, gameInfo.paddleOne.width, gameInfo.paddleOne.height);
    ctx.fillStyle = gameInfo.paddleOne.color
    ctx.strokeStyle = gameInfo.paddleOne.color
    ctx.lineWidth = 1
    ctx.fillStyle = gameInfo.paddleOne.color
    ctx.shadowBlur = 0
    ctx.shadowColor = 'blue'
    ctx.strokeRect(gameInfo.paddleOne.x, gameInfo.paddleOne.y, gameInfo.paddleOne.width, gameInfo.paddleOne.height)
    ctx.fill()
}
