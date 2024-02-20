import { WebSocketContextType } from '@/context/webSocketContext'

import { GameStat, imageForGame } from '@/lib/Game/Game.types'



type keyData = {
	key: string,
	roomId: string,
}
export function Paddle_2(
    ctx: CanvasRenderingContext2D,
    gameInfo: GameStat,
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
        gameInfo.paddle_2.x,
        gameInfo.paddle_2.y,
        gameInfo.paddle_2.width,
        gameInfo.paddle_2.height
    )
    // ctx.rect(gameInfo.paddle_2.x, gameInfo.paddle_2.y, gameInfo.paddle_2.width, gameInfo.paddle_2.height);
    ctx.fillStyle = gameInfo.paddle_2.color
    ctx.strokeStyle = gameInfo.paddle_2.color
    ctx.lineWidth = 1
    ctx.fillStyle = gameInfo.paddle_2.color
    ctx.shadowBlur = 0
    ctx.shadowColor = 'blue'
    ctx.strokeRect(gameInfo.paddle_2.x, gameInfo.paddle_2.y, gameInfo.paddle_2.width, gameInfo.paddle_2.height)
    ctx.fill()
}

export function Paddle_1(
    ctx: CanvasRenderingContext2D,
    gameInfo: GameStat,
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
        gameInfo.paddle_1.x,
        gameInfo.paddle_1.y,
        gameInfo.paddle_1.width,
        gameInfo.paddle_1.height
    )
    // ctx.rect(gameInfo.paddle_1.x, gameInfo.paddle_1.y, gameInfo.paddle_1.width, gameInfo.paddle_1.height);
    ctx.fillStyle = gameInfo.paddle_1.color
    ctx.strokeStyle = gameInfo.paddle_1.color
    ctx.lineWidth = 1
    ctx.fillStyle = gameInfo.paddle_1.color
    ctx.shadowBlur = 0
    ctx.shadowColor = 'blue'
    ctx.strokeRect(gameInfo.paddle_1.x, gameInfo.paddle_1.y, gameInfo.paddle_1.width, gameInfo.paddle_1.height)
    ctx.fill()
}
