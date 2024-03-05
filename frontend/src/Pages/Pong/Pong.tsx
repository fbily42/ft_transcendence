import { useEffect, useState } from 'react'
import Board from './Game'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import { GameStats } from '@/lib/Game/Game.types'
import BasicGame from './BasicGame'
// import { Button } from '@/components/ui/button'
import PinguPlaying from '../../assets/Game/pingu_player.svg'
import Clouds from '../../assets/other/cloud.svg'
import Mountains from '../../assets/other/mountain.svg'
import { Pingu } from '@/assets/avatarAssociation'
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
    const closeDialog = () => {
        setOpen(false)
    }
    useEffect(() => {
        const cleanup = () => {
            // Call all your cleanup functions here
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

    // useEffect(() => {
    //     return () => {
    //         socket?.webSocket?.emit('leaveRoom', roomName)
    //     }
    // }, [roomName])
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
                    <div className='flex gap-[10px]'>
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
                                <GameForm closeDialog={closeDialog}></GameForm>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Pong

// {!gameInfo && (
// 	<div
// 		id="bento"
// 		className="flex flex-col justify-between pl-[122px] pb-[36px] pr-[36px] h-[90vh] gap-[36px]"
// 	>
// 		<div
// 			id="top bento"
// 			className="flex w-[100%] h-[50%] justify-between lg:gap-[36px] md:gap-[26px] sm:gap-[26px] gap-[26px]"
// 		>
// 			<div
// 				id="play box"
// 				className="relative bg-customDarkBlue w-[80%] h-full rounded-[30px] overflow-hidden border-none shadow-drop"
// 			>
// 				<div
// 					id="content w/o clouds and mountain"
// 					className="z-20 absolute h-full w-full flex items-center pl-6 pb-2"
// 				>
// 					<div
// 						id="pingu div"
// 						className="z-20 h-full w-[40%] flex items-end pl-7 pb-3 "
// 					>
// 						<img
// 							className="h-fit"
// 							src={PinguPlaying}
// 							alt="Pingu playing ball"
// 						></img>
// 					</div>
// 					<div
// 						id="cta div"
// 						className="z-20 h-full w-full flex flex-col items-center justify-center gap-[36px]"
// 					>
// 						<h1 className="text-white text-wrap text-center text-6xl font-semibold">
// 							Let's Play PinguPong
// 						</h1>

// 					</div>
// 				</div>
// 				<div
// 					id="clouds + mountains"
// 					className="z-0 absolute flex flex-col justify-between h-full border-t-[20px] border-b-[20px] border-white"
// 				>
// 					<div
// 						id="clouds"
// 						className="flex -space-x-[20px]"
// 					>
// 						{CloudsArray.map((cloud, index) => (
// 							<img
// 								key={index}
// 								src={cloud}
// 								alt="Clouds"
// 							/>
// 						))}
// 					</div>
// 					<div
// 						id="mountain"
// 						className="flex -space-x-[10px]"
// 					>
// 						{MountainsArray.map((mountain, index) => (
// 							<img
// 								key={index}
// 								src={mountain}
// 								alt="Mountains"
// 							/>
// 						))}
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	</div>
// )}
