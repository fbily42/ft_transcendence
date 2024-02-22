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
import ImageAllGame from '../../assets/GameForm/ImageAllGame.svg'
import BasicPong from '../../assets/GameForm/Pong_Image.svg'
import { Checkbox } from '@/components/ui/checkbox'

// interface GameFormprops {
// 	onClose: () => void;
// }
function GameForm({ closeDialog }) {
    const [search, setSearch] = useState('')
    const socket = useWebSocket()
    // const [matchmaking, setMatchmaking] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingFriend, setLoadingFriend] = useState(false)
    const currentRoom = useRef<string | null>(null)
    const currentRoomFriend = useRef<string | null>(null)
    const processingMessage = useRef(false)
    const [inputValue, setInputValue] = useState('')
    const [selectedImage, setSelectedImage] = useState<string>('')

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        //verifier que l'utilisateur existe pour pourvoir derouler
        setSearch(inputValue)
    }
    const handleSearch = async (event: any) => {
        event.preventDefault()
        try {
            if (!loading) {
                setLoadingFriend(true)
            } else {
                setLoadingFriend(false)
            }
            //verifier que la personne est en ligne pour envoyer l'invitation
            //verifier que la personne est bien connecte pour envoyer l'invitation

            socket?.webSocket?.emit('game invitation', {
                to: search,
                game: response.data,
            })
        } catch (error) {}

        // setResults([search]); // Mettez à jour cette ligne pour afficher les vrais résultats
        // setSearch('')
    }
    useEffect(() => {
        if (loadingFriend) {
            const roomName: string = generateUniqueRoomId()
            currentRoomFriend.current = roomName
            socket?.webSocket?.emit('JoinRoomFriend', roomName)
            if (search) {
            }
        }
    })

    function generateUniqueRoomId() {
        const now = Date.now() // Obtient le timestamp actuel
        const random = Math.random() * 1000 // Génère un nombre aléatoire
        return `room_${now}_${Math.floor(random)}` // Combine les deux pour créer un ID
    }
    useEffect(() => {
        //mettre fin au matchmaking des qu'il ferme le modal

        if (loading) {
            const roomName: string = generateUniqueRoomId()
            currentRoom.current = roomName
            socket?.webSocket?.emit('JoinRoom', roomName)
            socket?.webSocket?.on('JoinParty', (message: string) => {
                let words = message.split(' ')
                let lastWord = words[words.length - 1]
                if (message.startsWith('You have joined')) {
                    processingMessage.current = true
                    closeDialog()
                    navigate('/pong')
                } else if (message.startsWith('Go')) {
                    processingMessage.current = true
                    closeDialog()
                    navigate('/pong')
                } else return //error
            })
        } else if (currentRoom.current) {
            socket?.webSocket?.emit('leaveRoomBefore', currentRoom.current)
        }

        return () => {
            socket?.webSocket?.off('JoinParty')

            if (loading && !processingMessage.current) {
                setLoading(false)
                socket?.webSocket?.emit('leaveRoomBefore', currentRoom.current)
            }
        }
    }, [loading])
    async function handleMatchmaking(event: any) {
        event.preventDefault()
        if (!loading) {
            setLoading(true)
        } else {
            setLoading(false)
        }
    }

    return (
        <div className=" p-5 bg-blue-800 mb-[20px] h-fit">
            {/* image en haut a droite */}
            <div className="fixed-0 ">
                <img
                    src={pingu_duo}
                    alt="Pingu with Robby"
                    className="absolute top-[-80px] right-0"
                />
            </div>
            {/* recherche d'amis */}
            <div className="mb-[20px] bg-white h-fit">
                <p className="mb-[14px]">
                    Choose an online friend to play with{' '}
                </p>
                <form
                    onSubmit={handleFormSubmit}
                    className="w-full mb-10 border-2 border-black rounded-xl p-2 pr-2 mb-4 realtive flex items-center "
                >
                    <Search className="" />
                    <div className="ml-[10px] bg-white">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
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
                {search && (
                    <div className="">
                        <div className="flex gap-[20px]">
                            <p> Choose the level</p>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="terms" />
                                <label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Easy
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="terms" />
                                <label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Normal
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="text" />
                                <label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 "
                                >
                                    Hard
                                </label>
                            </div>
                        </div>

                        <div>
                            <p> Choose the Map</p>
                        </div>
                        <div className="flex justify-between gap-[20px]">
                            <div
                                className={`realtive p-2 ${selectedImage === 'ImageAllGame' ? 'rounded border-4 border-blue-500 ' : ''}`}
                                onClick={() => {
                                    if (!selectedImage)
                                        setSelectedImage('ImageAllGame')
                                    else if (selectedImage === 'BasicPong')
                                        setSelectedImage('ImageAllGame')
                                    else setSelectedImage('')
                                    // Gérer le clic sur l'image ici
                                }}
                            >
                                <img
                                    src={ImageAllGame}
                                    width="200px"
                                    height="200px"
                                    alt="description_of_the_image"
                                />
                                <p className="text-center">
                                    Our creation ! PinguPlace
                                </p>

                                {/* Ajoutez plus d'options ici si nécessaire */}
                            </div>
                            <div
                                className={`realtive p-2 ${selectedImage === 'BasicPong' ? 'rounded border-4 border-blue-500 ' : ''}`}
                                onClick={() => {
                                    if (!selectedImage)
                                        setSelectedImage('BasicPong')
                                    else if (selectedImage === 'ImageAllGame')
                                        setSelectedImage('BasicPong')
                                    else setSelectedImage('')
                                    // Gérer le clic sur l'image ici
                                }}
                            >
                                <img
                                    src={BasicPong}
                                    width="250px"
                                    height="250px"
                                    alt="description_of_the_image"
                                />
                                <p className="text-center">Bad Choice</p>

                                {/* Ajoutez plus d'options ici si nécessaire */}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* Permet d'avoir un historique des recherchers */}
            {/* <ul>
				{results.map((result, index) => (
					<li key={index}>{result}</li>
				))}
			</ul> */}
            {/* MatchMaking */}
            <div
                className="flex flex-col  h-full mb-[20px] bg-yellow-300 justify-end gap-[20px]"
                style={{ height: '50%' }}
            >
                <p>Or find a random player </p>
                <form onSubmit={handleMatchmaking}>
                    <button
                        className="w-full  border-2 bg-blue-200 border-blue-500 rounded-xl p-2 pr-2 gap-[10px]"
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
;('use client')
