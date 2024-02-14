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
import { GameStat } from '@/lib/Game/Game.types'
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

	const img_fish = new Image()
	const img_filet = new Image()
	const img_grey = new Image()
	const img_pingu = new Image()
	const img_pingu_score = new Image()
	const img_grey_score = new Image()
	const img_ice = new Image()
	const img_ice_bottom = new Image()

    // socket?.webSocket?.on('Ready', (room:string )=> {
    // 	roomName = room;
    // 	console.log("inside",roomName);
    // })
    // console.log('Not inside ',roomName);
    // if (roomName ===  'false')
    // 	return;

    socket?.webSocket?.on('Ready', (room: string) => {
        const roomName = room
        setRoomName(roomName)
		console.log(`Je recois room : ${room}`)
        socket?.webSocket?.emit('CreateGameinfo', room)
        //   console.log("inside",roomName);
    })

	const handleKeyDown = (event: KeyboardEvent) => {
		if (keys[event.key]) {
			return
		}
		setKeys((prevKeys) => ({ ...prevKeys, [event.key]: true }))
	}

	const handleKeyUp = (event: KeyboardEvent) => {
		setKeys((prevKeys) => ({ ...prevKeys, [event.key]: false }))
	}
	window.addEventListener('keydown', handleKeyDown)
	
	window.addEventListener('keyup', handleKeyUp)

    useEffect(() => {
        let { ballObj, paddle_1, paddle_2, Game_stat } = data
		socket?.webSocket?.on('UpdateKey', (Game_stat: GameStat) => {
			console.log('Je set gameState :', Game_stat)
			setGameInfo(Game_stat);
		})
        // imgRef.current = new Image(); //possible besoin d'ajouter un if (imgRef) comme pour canvas
        let animationFrameId: number
        console.log('je suis ici 5')
		
        const render = () => {
			console.log('Je vais render dans cette roon : ' + roomName)
            const canvas = canvasRef.current
            if (canvas) {
                paddle_2.x = canvas?.width - 70
                const ctx = canvas.getContext('2d')
                if (!ctx) return
                if (Game_stat.Gamestate === 'playing') {
                    img_ice_bottom.src = ice_bottom
                    img_ice.src = ice
                    img_fish.src = fish
                    img_filet.src = filet
                    img_grey.src = grey
                    img_pingu.src = pingu
                    img_pingu_score.src = pingu_score
                    img_grey_score.src = grey_score

                    // console.log("la hauteur est de ",canvas.height, "la largeur est de ",canvas.width)
                    // if (img_fishRef.current)
                    // 	ctx.drawImage(img_fishRef.current, ballObj.x, ballObj.y, 10, 10);
                    ctx?.clearRect(0, 0, canvas.width, canvas.height)
                    Static_image(
                        ctx,
                        canvas,
                        img_filet,
                        img_ice,
                        img_ice_bottom
                    )
                    BallMovement(ctx, ballObj, img_fish)
                    if (socket && gameInfo) {
                        Paddle_1(
                            ctx,
                            canvas,
							gameInfo,
                            keys,
                            img_pingu,
                            socket,
                            roomName,

                        )
                        Paddle_2(
                            ctx,
                            canvas,
                            gameInfo,
                            keys,
                            img_grey,
                            socket,
                            roomName,
                        )
                    }
                    if (
                        WallCollision(
                            ballObj,
                            canvas,
                            ctx,
                            Game_stat,
                            img_grey_score,
                            img_pingu_score
                        ) == 1
                    )
                        console.log(' tu as marque')
                    Paddle_Collision(ballObj, paddle_1)
                    Paddle_Collision(ballObj, paddle_2)
                }
            }
            animationFrameId = requestAnimationFrame(render)
        }
        render()

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
			socket?.webSocket?.off('UpdateKey')
            // window.removeEventListener('keydown', handleKeyDown);
            cancelAnimationFrame(animationFrameId)
        }
        // }
    })

    return (
        <canvas id="canvas_pong" ref={canvasRef} height={1600} width="1600px" />
    )
}
