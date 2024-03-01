import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Dashboard from '../Dashboard/Dashboard'
import Chat from '../Chat/Chat';
import Modal from '@/components/Modal';
import axios from 'axios';
import GameForm from '@/components/Pong/GameForm';
import Board from './Game';
import Basic from './BasicGame';
import { useWebSocket } from '@/context/webSocketContext';
import { GameStats } from '@/lib/Game/Game.types';
import BasicGame from './BasicGame';


// faire un decompte en blur ou on voit le jeu en arriere plan, prevoir le cas de la reconnection pour ne pas declencher le decompte dans ce cas la 
// solution possible faire le decompte ici mais envoyer la fonction qui change le useState dans la fonction Board
function Pong() {
	const [roomName, setRoomName] = useState<string>('')
	const socket = useWebSocket()
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
	// État pour déterminer si le Board doit être affiché
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