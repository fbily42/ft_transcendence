import {
    BallMovement,
    WallCollision,
    Paddle_Collision,
    Paddle_hit,
} from '@/components/Pong/Game utils/Ballmovement'
import { Paddle_1, Paddle_2 } from '@/components/Pong/Game utils/Paddle'
// import Paddle_2 from "@/components/Pong/Game utils/Paddle";
import data from '@/components/Pong/Game utils/data'
import React, { useEffect, useRef, useState } from 'react'
import fish from './../../assets/Game/fish.svg'
import filet from './../../assets/Game/filet.svg'
import grey from './../../assets/Game/grey.svg'
import pingu from './../../assets/Game/pingu.svg'
import Static_image from '@/components/Pong/Game utils/design'
import pingu_score from './../../assets/Game/pingu_score.svg'
import grey_score from './../../assets/Game/grey_score.svg'
import ice from './../../assets/Game/ice.svg'
import ice_bottom from './../../assets/Game/ice_bottom.svg'
import { useQuery } from '@tanstack/react-query'
import { getUserMe } from '@/lib/Dashboard/dashboard.requests'
import { useWebSocket } from '@/context/webSocketContext'
import { Socket } from 'socket.io-client'
import { GameStats, imageForGame } from '@/lib/Game/Game.types'
// import { Image } from "@/components/Pong/Game utils/data";

//creer une map room pour lier l'ID de la room avec un objec, pour a chaque fois renvoyer l'objet modifier
type keyData = {
    key: string
    roomId: string
}
export default function Basic() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    // const imgRef = useRef<HTMLImageElement | null>(null);
    const [keys, setKeys] = useState<{ [key: string]: boolean }>({})
    // const {data: me} = useQuery({queryKey:['me'], queryFn:getUserMe});//photo client me?.photo42
    const socket = useWebSocket()

    const [roomName, setRoomName] = useState<string>('false')
    const [gameInfo, setGameInfo] = useState<GameStats>()

    const gameImages = new imageForGame()

    const handleKeyDown = (event: KeyboardEvent) => {
        if (keys[event.key]) {
            return
        }
        setKeys((prevKeys) => ({ ...prevKeys, [event.key]: true }))
    }

    const handleKeyUp = (event: KeyboardEvent) => {
        setKeys((prevKeys) => ({ ...prevKeys, [event.key]: false }))
    }

    useEffect(() => {
        socket?.webSocket?.on('Ready', (room: string) => {
            const roomName = room
            setRoomName(roomName)
            console.log('Ready')
            socket?.webSocket?.emit('CreateGameinfo', room)
        })
        console.log('etape 4')
        socket?.webSocket?.on('UpdateKey', (gameStats: GameStats) => {
            console.log('je suis mis a jour')
            setGameInfo(gameStats)
        })
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            socket?.webSocket?.off('UpdateKey')
            socket?.webSocket?.off('Ready')
            window.removeEventListener('keyup', handleKeyUp)
            socket?.webSocket?.emit('leaveRoom')
        }
    }, [socket])

    useEffect(() => {
        let animationFrameId: number
        // imgRef.current = new Image(); //possible besoin d'ajouter un if (imgRef) comme pour canvas
        const canvas = canvasRef.current
        if (!canvas) return

        const render = () => {
            console.log('etape 3', gameInfo)
            const ctx = canvas.getContext('2d')
            if (!ctx) return
            if (gameInfo) {
                gameInfo.paddleTwo.x = canvas?.width - 70

                if (gameInfo.gameStatus.gameState === 'playing') {
                    console.log('etape 2')
                    // if (img_fishRef.current)
                    // 	ctx.drawImage(img_fishRef.current, ballObj.x, ballObj.y, 10, 10);
                    ctx?.clearRect(0, 0, canvas.width, canvas.height)
                    Static_image(ctx, canvas, gameImages)
                    if (socket && gameInfo) {
                        //ball
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
                        //paddle gauche
                        ctx.rect(
                            gameInfo.paddleOne.x,
                            gameInfo.paddleOne.y,
                            gameInfo.paddleOne.width,
                            gameInfo.paddleOne.height
                        )
                        ctx.fillStyle = gameInfo.paddleOne.color
                        ctx.strokeStyle = gameInfo.paddleOne.color
                        ctx.lineWidth = 1
                        ctx.fillStyle = gameInfo.paddleOne.color
                        ctx.shadowBlur = 0
                        ctx.shadowColor = 'blue'
                        ctx.strokeRect(
                            gameInfo.paddleOne.x,
                            gameInfo.paddleOne.y,
                            gameInfo.paddleOne.width,
                            gameInfo.paddleOne.height
                        )
                        ctx.fill()
                        if (keys['a']) {
                            socket?.webSocket?.emit('key', {
                                key: 'a',
                                roomId: roomName,
                            })
                        } else if (keys['d']) {
                            socket?.webSocket?.emit('key', {
                                key: 'd',
                                roomId: roomName,
                            })
                        }
                        //paddle 2
                        // ctx.rect(gameInfo.paddleTwo.x, gameInfo.paddleTwo.y, gameInfo.paddleTwo.width, gameInfo.paddleTwo.height);
                        ctx.fillStyle = gameInfo.paddleTwo.color
                        ctx.strokeStyle = gameInfo.paddleTwo.color
                        ctx.lineWidth = 1
                        ctx.fillStyle = gameInfo.paddleTwo.color
                        ctx.shadowBlur = 0
                        ctx.shadowColor = 'blue'
                        ctx.strokeRect(
                            gameInfo.paddleTwo.x,
                            gameInfo.paddleTwo.y,
                            gameInfo.paddleTwo.width,
                            gameInfo.paddleTwo.height
                        )
                        ctx.fill()
                        if (keys['ArrowUp']) {
                            const data: keyData = {
                                key: 'ArrowUp',
                                roomId: roomName,
                            }
                            socket?.webSocket?.emit('key', data)
                        } else if (keys['ArrowDown']) {
                            socket?.webSocket?.emit('key', {
                                key: 'ArrowDown',
                                roomId: roomName,
                            })
                        }
                    }
                    if (
                        socket &&
                        WallCollision(
                            gameInfo,
                            canvas,
                            ctx,
                            gameImages,
                            socket,
                            roomName
                        ) == 1
                    )
                        console.log(' tu as marque')
                    if (socket) {
                        Paddle_Collision(
                            gameInfo,
                            gameInfo.paddleOne,
                            socket,
                            roomName
                        )
                        // Paddle_Collision(gameInfo, gameInfo.paddleTwo)
                    }
                } else if (gameInfo.gameStatus.gameState === 'finish') {
                    socket?.webSocket?.emit('endGame', roomName)
                    console.log('finish')
                    console.log(
                        'avant le if Winner: ',
                        gameInfo.gameStatus.winner,
                        'avant le looser : ',
                        gameInfo.gameStatus.looser
                    )
                    if (gameInfo.gameStatus.winner) {
                        console.log(
                            'Winner: ',
                            gameInfo.gameStatus.winner,
                            'looser : ',
                            gameInfo.gameStatus.looser
                        )

                        cancelAnimationFrame(animationFrameId)
                    }
                    // return //mettre le modal victoire joueur 1 et defaite joueur 2
                }
            }
            animationFrameId = requestAnimationFrame(render)
        }
        render()
        // requestAnimationFrame(render)
        return () => {
            // socket?.webSocket?.emit('leaveRoom', roomName) // faire un autre else if gameInfo.gameStatus.gameState === "you adversaire leave" pour ensuite gerer comment rediriger le joueur qui est reste, donc dans le leave room il faut envoyer un emit a l'autre joueur
            // window.removeEventListener('keydown', handleKeyDown);
            cancelAnimationFrame(animationFrameId)
        }
        // }
    }, [])

    return (
        <canvas id="canvas_pong" ref={canvasRef} height={1600} width="1600px" />
    )
}
