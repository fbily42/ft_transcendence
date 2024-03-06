import { useEffect, useState } from 'react'
import Board from './Game'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import { GameStats } from '@/lib/Game/Game.types'
import BasicGame from './BasicGame'
import PinguPlaying from '../../assets/Game/pingu_player.svg'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import GameForm from '@/components/Pong/GameForm'
function Pong() {
    const [roomName, setRoomName] = useState<string>('')
    const socket = useWebSocket() as WebSocketContextType
    const [gameInfo, setGameInfo] = useState<GameStats>()
    const [keys, setKeys] = useState<{ [key: string]: boolean }>({})
    const [gameStatus, setGameStatus] = useState<'PLAYING' | 'FINISH'>(
        'PLAYING'
    )
    const [open, setOpen] = useState<boolean>(false)
    useEffect(() => {
        const cleanup = () => {
            socket?.webSocket?.emit('leaveRoom', roomName)
        }

        const handleBeforeUnload = () => {
            cleanup()
        }

        window.addEventListener('beforeunload', handleBeforeUnload)

        return () => {
            cleanup()
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [roomName])

    const handleKeyDown = (event: KeyboardEvent) => {
        if (keys[event.key]) {
            return
        }
        setKeys((prevKeys: { [key: string]: boolean }) => ({
            ...prevKeys,
            [event.key]: true,
        }))
    }

    const handleKeyUp = (event: KeyboardEvent) => {
        setKeys((prevKeys: { [key: string]: boolean }) => ({
            ...prevKeys,
            [event.key]: false,
        }))
    }

    useEffect(() => {
        socket?.webSocket?.on('finish', (gameStats: GameStats) => {
            setGameStatus('FINISH')
            setGameInfo(gameStats)
        })
        return () => {
            socket?.webSocket?.off('finish')
        }
    }, [socket])

    useEffect(() => {
        socket?.webSocket?.on('Ready', (data) => {
            const roomName = data.roomId
            setRoomName(roomName)
            socket?.webSocket?.emit('CreateGameinfo', data)
        })
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
    return (
        <div className="flex flex-col justify-center items-center pl-[122px] pb-[36px] pr-[36px] h-[90vh] gap-[36px]">
            {gameInfo && gameInfo?.gameStatus?.map === 'mapPingu' && (
                <Board
                    gameStatus={gameStatus}
                    gameInfo={gameInfo}
                    keys={keys}
                    roomName={roomName}
                />
            )}
            {gameInfo && gameInfo?.gameStatus?.map === 'BasicPong' && (
                <BasicGame
                    gameStatus={gameStatus}
                    gameInfo={gameInfo}
                    keys={keys}
                    roomName={roomName}
                />
            )}
            {!gameInfo && (
                <div className="flex flex-col items-center w-[100%] gap-[36px] max-w-[500px] ">
                    <h2 className="flex justify-center font-semibold text-2xl text-center">
                        ¡ What the Noooot are you doing here !
                    </h2>
                    <div className="flex gap-[10px]">
                        <img
                            className="w-[100%]"
                            src={PinguPlaying}
                            alt="Pingu"
                        ></img>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-customYellow">
                                    ここをクリック
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <GameForm
                                    handleClose={() => setOpen(false)}
                                    name={undefined}
                                ></GameForm>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Pong
