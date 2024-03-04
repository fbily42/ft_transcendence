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
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import { Socket } from 'socket.io-client'
import { GameStats, imageForGame } from '@/lib/Game/Game.types'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { UserData } from '@/lib/Dashboard/dashboard.types'
import loose_game from './../../assets/Game/loose_game.svg'
import win_game from './../../assets/Game/win_game.svg'
// import { Image } from "@/components/Pong/Game utils/data";

//creer une map room pour lier l'ID de la room avec un objec, pour a chaque fois renvoyer l'objet modifier

interface BoardProps {
    gameStatus: 'FINISH' | 'PLAYING'
    gameInfo: GameStats
    keys: { [key: string]: boolean }
    roomName: string
}
//gameStatus, gameInfo, keys, roomName
const Board: React.FC<BoardProps> = ({
    gameStatus,
    gameInfo,
    keys,
    roomName,
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    const navigate = useNavigate()
    // const imgRef = useRef<HTMLImageElement | null>(null);

    // const {data: me} = useQuery({queryKey:['me'], queryFn:getUserMe});//photo client me?.photo42
    const socket = useWebSocket() as WebSocketContextType



    const gameImages = new imageForGame()


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
        const canvas = canvasRef.current
        if (!canvas) return

        const render = () => {
            const ctx = canvas.getContext('2d')
            if (!ctx) return
            if (!gameInfo || !socket) return
            ctx?.clearRect(0, 0, canvas.width, canvas.height)
            Static_image(ctx, canvas, gameImages)
            BallMovement(ctx, gameInfo, gameImages) //envoie un update
            Paddle_1(ctx, gameInfo, keys, gameImages, socket, roomName) //envoie un update si a ou d utilise
            Paddle_2(ctx, gameInfo, keys, gameImages, socket, roomName) //envoie un update si Arrowup ou ArrowDown utilise, gerer l'image
            socket.webSocket?.emit('ballMov', roomName)
            updatescore(gameImages, gameInfo, ctx, canvas)
            animationFrameId = requestAnimationFrame(render)
        }
        //  render()
        animationFrameId = requestAnimationFrame(render)
        return () => {
            // socket?.webSocket?.emit('leaveRoom', roomName) // faire un autre else if gameInfo.gameStatus.gameState === "you adversaire leave" pour ensuite gerer comment rediriger le joueur qui est reste, donc dans le leave room il faut envoyer un emit a l'autre joueur
            // window.removeEventListener('keydown', handleKeyDown);
            cancelAnimationFrame(animationFrameId)
        }
        // }
    }, [gameStatus, gameInfo])

    const { data: me } = useQuery<UserData>({
        queryKey: ['me'],
        queryFn: getUserMe,
    })
    return (
        <>
            <canvas id="canvas_pong" ref={canvasRef} height={800} width={800} />
            {gameStatus === 'FINISH' && (
                <div className="h-screen w-screen fixed top-0 left-0 ">
                    <Dialog defaultOpen={true}>
                        <DialogContent
                            onInteractOutside={() => {
                                navigate('/')
                            }}
                        >
                            {/* <DialogHeader> */}
                            <DialogTitle>
                                <div className="flex items-center justify-center">
                                    {gameInfo?.gameStatus.looser === me?.name &&
                                        'Noooooooot ! You lose'}
                                    {gameInfo?.gameStatus.winner === me?.name &&
                                        'Hurray ! You Won'}
                                </div>
                            </DialogTitle>
                            {/* <DialogDescription> */}
                            {gameInfo?.gameStatus.looser === me?.name ? (
                                <div className="flex items-center justify-center">
                                    <img
                                        src={loose_game}
                                        alt="Pingu with Robby"
                                        className=""
                                    />
                                </div>
                            ) : (
                                // {gameInfo?.gameStatus.winner ===
                                //     me?.name &&
                                <div className="flex items-center justify-center">
                                    <img
                                        src={win_game}
                                        alt="Pingu with Robby"
                                        className=""
                                    />
                                </div>
                            )}
                            {/* </DialogDescription> */}
                            <div className="flex justify-center items-center">
                                <Button
                                    className="w-[50%]"
                                    onClick={() => {
                                        navigate('/')
                                    }}
                                >
                                    Leave the Game
                                </Button>
                            </div>
                            {/* </DialogHeader> */}
                        </DialogContent>
                    </Dialog>

                    {/* <p> the winner is {gameInfo?.gameStatus.winner}</p>
                    <p>The loser is {gameInfo?.gameStatus.looser}</p>
                    <p>
                        {gameInfo?.gameStatus.scoreOne}:
                        {gameInfo?.gameStatus.scoreTwo}
                    </p> */}
                </div>
            )}
        </>
    )
}

export default Board
