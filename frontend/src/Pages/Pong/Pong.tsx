
import { useEffect, useState } from 'react'
import Board from './Game';
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext';
import { GameStats } from '@/lib/Game/Game.types';
import BasicGame from './BasicGame';


function Pong() {
	const [roomName, setRoomName] = useState<string>('')
	const socket = useWebSocket() as WebSocketContextType
	const [gameInfo, setGameInfo] = useState<GameStats>()
	const [keys, setKeys] = useState<{ [key: string]: boolean }>({})
	const [gameStatus, setGameStatus] = useState<'PLAYING' | 'FINISH'>(
        'PLAYING'
    )
	useEffect(() => {
        return () => {
            socket?.webSocket?.emit('leaveRoom', roomName)
        }
    }, [roomName])
	const handleKeyDown = (event: KeyboardEvent) => {
        if (keys[event.key]) {
            return
        }
        setKeys((prevKeys: { [key: string]: boolean }) => ({ ...prevKeys, [event.key]: true }))
    }

    const handleKeyUp = (event: KeyboardEvent) => {
        setKeys((prevKeys: { [key: string]: boolean }) => ({ ...prevKeys, [event.key]: false }))
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
	  <div className='flex flex-col justify-center pl-[122px] pb-[36px] pr-[36px] h-[90vh] gap-[36px]'>
		
		  {gameInfo && gameInfo.gameStatus.map === 'mapPingu' && <Board gameStatus={gameStatus} gameInfo={gameInfo} keys={keys} roomName={roomName} />}
		  {gameInfo && gameInfo.gameStatus.map === 'BasicPong' && <BasicGame gameStatus={gameStatus} gameInfo={gameInfo} keys={keys} roomName={roomName} />}
	  </div>
	);
  }
export default Pong