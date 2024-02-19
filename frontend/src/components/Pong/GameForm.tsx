import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import React, { useRef, KeyboardEvent } from 'react'
import { Search } from 'lucide-react'
import { XCircle } from 'lucide-react'
import axios from 'axios'
import { useWebSocket } from '@/context/webSocketContext'
import pingu_duo from './../../assets/Pong_page/duo.png'
import { Socket } from 'socket.io-client'
import { useNavigate } from 'react-router-dom'

// interface GameFormprops {
// 	onClose: () => void;
// }
function GameForm({ closeDialog }) {
    const [search, setSearch] = useState('')
    const socket = useWebSocket()
    // const [matchmaking, setMatchmaking] = useState(false)
    const [loading, setLoading] = useState(false)
    const currentRoom = useRef<string | null>(null)
    const processingMessage = useRef(false)

    // const [results, setResults] = useState([]);

    const handleSearch = async (event: any) => {
        event.preventDefault()
        try {
            //verifier que la personne est en ligne pour envoyer l'invitation
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/game/invitGame/${search}`,
                {
                    withCredentials: true,
                }
            )

            if (socket) {
                socket.emit('game invitation', {
                    to: search,
                    game: response.data,
                })
            }
        } catch (error) {}

        // setResults([search]); // Mettez à jour cette ligne pour afficher les vrais résultats
        setSearch('')
    }

    function generateUniqueRoomId() {
        const now = Date.now() // Obtient le timestamp actuel
        const random = Math.random() * 1000 // Génère un nombre aléatoire
        return `room_${now}_${Math.floor(random)}` // Combine les deux pour créer un ID
    }
    const navigate = useNavigate()
    useEffect(() => {
        console.log('nombre de tour')
        //mettre fin au matchmaking des qu'il ferme le modal
        if (socket) {
            if (loading) {
                const roomName: string = generateUniqueRoomId()
                currentRoom.current = roomName
                console.log('1 roomName:', roomName)
                console.log('2 currentRoom:', currentRoom.current)
                socket.webSocket?.on('JoinParty', (message: string) => {
                    let words = message.split(' ')
                    let lastWord = words[words.length - 1]
                    if (message.startsWith('You have joined')) {
                        console.log('message : ', message)
                        processingMessage.current = true
                        closeDialog()
                        navigate('/pong')
                        // console.log('join :', lastWord);//faire rejoindre la partie
                    } else if (message.startsWith('You have created')) {
                        console.log('message : ', message)
                        // closeDialog()
                        // processingMessage.current = true;
                    }
                    if (message.startsWith('Ready')) {
                        console.log('message : ', message)
                        //possiblement faire un emit pour ensuite pouvoir le recuperer dans le game pour avoir le nom de la room
                        processingMessage.current = true
                        closeDialog()
                        navigate('/pong')
                        // console.log('Start the Game');//faire rejoindre la partie
                    } else return //error
                    // setMatchmaking(true)
                    console.log('je suis rentre dnas le .on')
                })
                socket.webSocket?.emit('JoinRoom', roomName)
            } else if (currentRoom.current) {
                console.log('je leave dans le if ', currentRoom.current)
                socket?.webSocket?.emit('leaveRoom', currentRoom.current)
            }
            // socket.emit('JoinRoom', roomName);
        }
        //verifier qu'il y a une personne en ligne au moins autre que le client
        // socket.emit('game invitation random');
        // setMatchmaking(false)
        return () => {
            // setLoading(false)
            socket?.webSocket?.off('JoinParty')
            console.log(loading, processingMessage)
            if (loading && !processingMessage.current) {
                setLoading(false)
                console.log(
                    'leaveRoom dans le return',
                    currentRoom.current,
                    loading,
                    processingMessage
                )
                socket?.webSocket?.emit('leaveRoom', currentRoom.current)
                console.log('bool ', loading)
            } else
                console.log(
                    "je n'ai pas fait de leave en quittant le useEffect"
                )
        }
    }, [loading])
    async function handleMatchmaking(event: any) {
        event.preventDefault() //a quoi cela sert
        if (!loading) {
            console.log('loading passe a true')
            setLoading(true)
        } else {
            console.log('loading passe a false')
            setLoading(false)
        }
    }

    return (
        <div className=" p-5">
            <div className="fixed-0 ">
                <img
                    src={pingu_duo}
                    alt="Pingu with Robby"
                    className="absolute top-[-80px] right-0"
                />
            </div>
            <div className="mb-[20px] bg-blue-500" style={{ height: '50%' }}>
                <p className="mb-[14px]">
                    Choose an online friend to play with{' '}
                </p>
                <form
                    onSubmit={handleSearch}
                    className="w-full mb-10 border-2 border-black rounded-xl p-2 pr-2 mb-4 realtive flex items-center "
                >
                    <Search className="" />
                    <div className="ml-[10px] bg-red-500">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher des amis"
                            className="outline-none w-[350px]"
                            onBlur={(e) => {
                                e.target.style.outline = 'none'
                            }}
                            required
                        />
                    </div>
                    <XCircle className="fixed-0 " />
                </form>
            </div>
            {/* Permet d'avoir un historique des recherchers */}
            {/* <ul>
				{results.map((result, index) => (
					<li key={index}>{result}</li>
				))}
			</ul> */}
            <div className="mb-[20px] bg-blue-300" style={{ height: '50%' }}>
                <p className="mb-[14px]">Or find a random player </p>
                <form onSubmit={handleMatchmaking}>
                    <button
                        className="w-full flex justify-center border-2 bg-blue-200 border-blue-500 rounded-xl p-2 pr-2 mb-4"
                        type="submit"
                    >
                        {loading ? 'Matchmaking...(just wait)' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default GameForm
