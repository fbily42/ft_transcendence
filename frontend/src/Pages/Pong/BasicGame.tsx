import {
    BallMovement,
    updatescore,
} from '@/components/Pong/Game utils/Ballmovement'
import { Paddle_1, Paddle_2 } from '@/components/Pong/Game utils/Paddle'
import React, { useEffect, useRef } from 'react'
import { decoration } from '@/components/Pong/Game utils/design'
import { useQuery } from '@tanstack/react-query'
import { getUserMe } from '@/lib/Dashboard/dashboard.requests'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import { GameStats, imageForGame } from '@/lib/Game/Game.types'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { UserData } from '@/lib/Dashboard/dashboard.types'
import loose_game from './../../assets/Game/loose_game.svg'
import win_game from './../../assets/Game/win_game.svg'

interface BoardProps {
    gameStatus: 'FINISH' | 'PLAYING'
    gameInfo: GameStats
    keys: { [key: string]: boolean }
    roomName: string
}

const BasicGame: React.FC<BoardProps> = ({
    gameStatus,
    gameInfo,
    keys,
    roomName,
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const navigate = useNavigate()
    const socket = useWebSocket() as WebSocketContextType
    const gameImages = new imageForGame()
	const { data: me } = useQuery<UserData>({
		queryKey: ['me'],
		queryFn: getUserMe,
	})
	

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
			decoration(ctx, canvas )
            BallMovement(ctx, gameInfo, gameImages)
            Paddle_1(ctx, gameInfo, keys, gameImages, socket, roomName)
            Paddle_2(ctx, gameInfo, keys, gameImages, socket, roomName)
            socket.webSocket?.emit('ballMov', roomName)
            updatescore(gameImages, gameInfo, ctx, canvas)
            animationFrameId = requestAnimationFrame(render)
        }
        animationFrameId = requestAnimationFrame(render)
        return () => {
            cancelAnimationFrame(animationFrameId)
        }
    }, [gameStatus, gameInfo])

    return (
        <>
            <canvas
                id="canvas_pongBasic"
                ref={canvasRef}
                height={800}
                width={800}
            />
            {gameStatus === 'FINISH' && (
                <div className="h-screen w-screen fixed top-0 left-0 ">
                    <Dialog defaultOpen={true}>
                        <DialogContent
                            onInteractOutside={() => {
                                navigate('/')
                            }}
                        >
                            <DialogTitle>
                                <div className="flex items-center justify-center">
                                    {gameInfo?.gameStatus.looser === me?.name &&
                                        'Noooooooot ! You lose'}
                                    {gameInfo?.gameStatus.winner === me?.name &&
                                        'Hurray ! You Won'}
                                </div>
                            </DialogTitle>

                            {gameInfo?.gameStatus.looser === me?.name ? (
                                <div className="flex items-center justify-center">
                                    <img
                                        src={loose_game}
                                        alt="Pingu with Robby"
                                        className=""
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <img
                                        src={win_game}
                                        alt="Pingu with Robby"
                                        className=""
                                    />
                                </div>
                            )}
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
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </>
    )
}

export default BasicGame
