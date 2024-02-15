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
import { GameStat, imageForGame } from '@/lib/Game/Game.types'
// import { Image } from "@/components/Pong/Game utils/data";

//creer une map room pour lier l'ID de la room avec un objec, pour a chaque fois renvoyer l'objet modifier

export default function Board() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    // const imgRef = useRef<HTMLImageElement | null>(null);
    const [keys, setKeys] = useState<{ [key: string]: boolean }>({})
    // const {data: me} = useQuery({queryKey:['me'], queryFn:getUserMe});//photo client me?.photo42
    const socket = useWebSocket()

    const [roomName, setRoomName] = useState<string>('false')
    const [gameInfo, setGameInfo] = useState<GameStat>()

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

            socket?.webSocket?.emit('CreateGameinfo', room)
        })
        socket?.webSocket?.on('UpdateKey', (Game_stat: GameStat) => {
            setGameInfo(Game_stat)
        })
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            socket?.webSocket?.off('UpdateKey')
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [])

    useEffect(() => {
        // imgRef.current = new Image(); //possible besoin d'ajouter un if (imgRef) comme pour canvas
        let animationFrameId: number

        const render = () => {
            console.log('etape 2')
            const canvas = canvasRef.current
            if (canvas && gameInfo) {
                gameInfo.paddle_2.x = canvas?.width - 70
                const ctx = canvas.getContext('2d')
                if (!ctx) return
                console.log('etape 1')
                console.log(gameInfo)
                if (gameInfo.gamestatus.Gamestate === 'playing') {
                    console.log('inside !!')
                    gameImages.image.img_ice_bottom.src = ice_bottom
                    gameImages.image.img_ice.src = ice
                    gameImages.image.img_fish.src = fish
                    gameImages.image.img_filet.src = filet
                    gameImages.image.img_grey.src = grey
                    gameImages.image.img_pingu.src = pingu
                    gameImages.image.img_pingu_score.src = pingu_score
                    gameImages.image.img_grey_score.src = grey_score

                    // if (img_fishRef.current)
                    // 	ctx.drawImage(img_fishRef.current, ballObj.x, ballObj.y, 10, 10);
                    ctx?.clearRect(0, 0, canvas.width, canvas.height)
                    Static_image(ctx, canvas, gameImages)
                    if (socket && gameInfo) {
                        BallMovement(
                            ctx,
                            gameInfo,
                            gameImages,
                            socket,
                            roomName
                        ) //envoie un update
                        Paddle_1(
                            ctx,
                            gameInfo,
                            keys,
                            gameImages,
                            socket,
                            roomName
                        ) //envoie un update si a ou d utilise
                        Paddle_2(
                            ctx,
                            gameInfo,
                            keys,
                            gameImages,
                            socket,
                            roomName
                        ) //envoie un update si Arrowup ou ArrowDown utilise
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
                            gameInfo.paddle_1,
                            socket,
                            roomName
                        )
                        // Paddle_Collision(gameInfo, gameInfo.paddle_2)
                    }
                }
            }
            animationFrameId = requestAnimationFrame(render)
            console.log('END')
        }
        render()
        return () => {
            // socket?.websocket?.emit('leaveRoom')
            // window.removeEventListener('keydown', handleKeyDown);
            cancelAnimationFrame(animationFrameId)
        }
        // }
    })

    return (
        <canvas id="canvas_pong" ref={canvasRef} height={1600} width="1600px" />
    )
}
