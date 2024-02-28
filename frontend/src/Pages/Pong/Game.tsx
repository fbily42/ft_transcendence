import {
    BallMovement,
    WallCollision,
    Paddle_Collision,
    Paddle_hit,
    updatescore,
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

export default function Board() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [gameStatus, setGameStatus] = useState<'PLAYING' | 'FINISH'>(
        'PLAYING'
    )
    // const imgRef = useRef<HTMLImageElement | null>(null);
    const [keys, setKeys] = useState<{ [key: string]: boolean }>({})
    // const {data: me} = useQuery({queryKey:['me'], queryFn:getUserMe});//photo client me?.photo42
    const socket = useWebSocket()

    const [roomName, setRoomName] = useState<string>('')
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
        socket?.webSocket?.on('finish', (gameStats: GameStats) => {
            setGameStatus('FINISH')
            setGameInfo(gameStats)
        })
    }, [socket])

    useEffect(() => {
        socket?.webSocket?.on('Ready', (room: string) => {
            const roomName = room
            setRoomName(roomName)
            socket?.webSocket?.emit('CreateGameinfo', room)
        })
        console.log('etape 4')
        socket?.webSocket?.on('UpdateKey', (gameStats: GameStats) => {
            setGameInfo(gameStats)
        })
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            socket?.webSocket?.off('UpdateKey')
            socket?.webSocket?.off('Ready')
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [socket])

    useEffect(() => {
        return () => {
            socket?.webSocket?.emit('leaveRoom', roomName)
        }
    }, [roomName])
    gameImages.image.img_ice_bottom.src = ice_bottom
    gameImages.image.img_ice.src = ice
    gameImages.image.img_fish.src = fish
    gameImages.image.img_filet.src = filet
    gameImages.image.img_grey.src = grey
    gameImages.image.img_pingu.src = pingu
    gameImages.image.img_pingu_score.src = pingu_score
    gameImages.image.img_grey_score.src = grey_score
    useEffect(() => {
        if (gameStatus === 'FINISH') {
            return
        }
        let animationFrameId: number
        // imgRef.current = new Image(); //possible besoin d'ajouter un if (imgRef) comme pour canvas
        const canvas = canvasRef.current
        if (!canvas) return

        const render = () => {
            // console.log('etape 3', gameInfo)
            const ctx = canvas.getContext('2d')
            if (!ctx) return
            if (!gameInfo || !socket) return
            gameInfo.paddleTwo.x = canvas?.width - 70

            // console.log('etape 2', gameInfo.gameStatus.gameState)
            // if (img_fishRef.current)
            // 	ctx.drawImage(img_fishRef.current, ballObj.x, ballObj.y, 10, 10);
            ctx?.clearRect(0, 0, canvas.width, canvas.height)
            Static_image(ctx, canvas, gameImages)
            BallMovement(ctx, gameInfo, gameImages) //envoie un update
            Paddle_1(ctx, gameInfo, keys, gameImages, socket, roomName) //envoie un update si a ou d utilise
            Paddle_2(ctx, gameInfo, keys, gameImages, socket, roomName) //envoie un update si Arrowup ou ArrowDown utilise, gerer l'image
            socket.webSocket?.emit('ballMov', roomName)
            updatescore(gameImages, gameInfo, ctx, canvas)
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
    }, [gameStatus, gameInfo])

    return (
        <>
            <canvas id="canvas_pong" ref={canvasRef} height={800} width={800} />
            {gameStatus === 'FINISH' && (
                <div className="h-screen w-screen fixed top-0 left-0 bg-red-500 opacity-50">
                    <p>{gameInfo?.gameStatus.winner}</p>
                    <p>{gameInfo?.gameStatus.looser}</p>
                    <p>
                        {gameInfo?.gameStatus.scoreOne}:
                        {gameInfo?.gameStatus.scoreTwo}
                    </p>
                </div>
            )}
        </>
    )
}
