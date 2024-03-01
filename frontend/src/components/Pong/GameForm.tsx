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
import mapPingu from '../../assets/GameForm/ImageAllGame.svg'
import BasicPong from '../../assets/GameForm/Pong_Image.svg'
import { Checkbox } from '@/components/ui/checkbox'
import { boolean } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { getUserMe, getUsers } from '@/lib/Dashboard/dashboard.requests'
import { UserData } from '@/lib/Dashboard/dashboard.types'
import { randomUUID } from 'crypto'

// interface GameFormprops {
// 	onClose: () => void;
// }
function GameForm({ closeDialog }) {
    const [search, setSearch] = useState<string>('')
    const socket = useWebSocket()
    // const [matchmaking, setMatchmaking] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingFriend, setLoadingFriend] = useState(false)
    const [friendMessage, setFriendMessage] = useState<string>('Submit')
    const currentRoom = useRef<string | null>(null)
    const currentRoomFriend = useRef<string | null>(null)
    const processingMessage = useRef(false)
    const [inputValue, setInputValue] = useState('')
    const [selectedMap, setSelectedMap] = useState<string>('mapPingu')
    const navigate = useNavigate()
    const [selectedLevel, setSelectedLevel] = useState<string>('easy')

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
        if (search === '') {
            // setInputValue('')
            setFriendMessage('submit')
        }

        setSearch(e.target.value)
    }

    const { data: users } = useQuery<UserData[]>({
        queryKey: ['listOnline'],
        queryFn: getUsers,
    })

    const { data: me } = useQuery<UserData>({
        queryKey: ['me'],
        queryFn: getUserMe,
    })

    const checkOnline = (search: string) => {
        let name: string = ''

        for (const user of users!) {
            if (search === me?.pseudo) {
                setFriendMessage('Error3')
                return
            } else if (user.pseudo === search) {
                name = user.name
                break
            }
        }
        if (name && socket?.usersOn.has(name)) {
            setSearch(name)
            return true
        } else {
            setFriendMessage('Error2')
            return false
        }
    }

    const handleselectedLevel = (level: string) => {
        if (loadingFriend !== true) {
            if (selectedLevel === 'easy' && level === 'easy')
                setSelectedLevel('false')
            else if (selectedLevel !== 'easy' && level === 'easy')
                setSelectedLevel('easy')
            if (selectedLevel === 'normal' && level === 'normal')
                setSelectedLevel('false')
            else if (selectedLevel !== 'normal' && level === 'normal')
                setSelectedLevel('normal')
            if (selectedLevel === 'hard' && level === 'hard')
                setSelectedLevel('false')
            else if (selectedLevel !== 'hard' && level === 'hard')
                setSelectedLevel('hard')
        }
    }

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        //verifier que l'utilisateur existe pour pourvoir derouler
        // setSearch(inputValue)
    }


    const handleSearch = async (event: any) => {
        event.preventDefault()
        try {
            setSearch(inputValue)
            if (!selectedMap || selectedLevel === 'false') {
                setFriendMessage('Error')
                return
            }
            if (loadingFriend != true) {
                if (checkOnline(search)) {
                    setFriendMessage('true') 
                    setLoadingFriend(true)
                }
            } else if (loadingFriend) {
                setLoadingFriend(false)
                setFriendMessage('Submit')
                return
            }
        } catch (error) {}

        // setResults([search]); // Mettez à jour cette ligne pour afficher les vrais résultats
        // setSearch('')
    }

    //j'ai besoin de la map selectionne, le niveau choisit ainsi que le nom de la personne invite
    /* possible probleme :
	- Annuler une invitation  */

    useEffect(() => {
        if (loadingFriend === true) {
            setFriendMessage('true')
            const roomNameFriend: string = crypto.randomUUID()
            currentRoomFriend.current = roomNameFriend
			console.log("useEffect : ", selectedLevel)
            socket?.webSocket?.emit('JoinRoomFriend', {
                friend: search,
                roomId: roomNameFriend,
				level : selectedLevel,
				map: selectedMap
            })

            socket?.webSocket?.on('JoinPartyFriend', (message: string) => {
                if (message.startsWith('Error')) {
                    setFriendMessage('Error2')
                    setLoadingFriend(false)
                } else if (message.startsWith('Go')) {
                    processingMessage.current = true
                    closeDialog()
                    navigate('/pong')
                } else if (message.startsWith('Decline')) {
                    //tout remettre a 0 pour les usestate
                    socket?.webSocket?.emit('leaveRoomBefore', roomNameFriend)
                    setFriendMessage('Decline')
                    setLoadingFriend(false) //est ce que cela suffit et il va quitter la room au prochain useEffect
                } else return //error
            })
        } else if (currentRoomFriend.current) {
            socket?.webSocket?.emit('leaveRoomBefore', currentRoomFriend.current)
        }
        return () => {
            socket?.webSocket?.off('JoinPartyFriend')

            if (loadingFriend && !processingMessage.current) {
                setLoadingFriend(false)
                socket?.webSocket?.emit('leaveRoomBefore', currentRoomFriend.current)
            }
        }
    }, [loadingFriend])

    const CancelMatchmaking = () => {
        setLoading(false)
        return true
    }

    useEffect(() => {
        //mettre fin au matchmaking des qu'il ferme le modal

        if (loading) {
            const roomName: string = crypto.randomUUID()
            currentRoom.current = roomName
            socket?.webSocket?.emit('JoinRoom', roomName)
            socket?.webSocket?.on('JoinParty', (message: string) => {
                if (message.startsWith('Joined')) {
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

    useEffect(() => {
        if (search) {
            CancelMatchmaking()
        }
    }, [search])

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
                    <XCircle
                        className="fixed-0 "
                        onClick={() => {
                            setInputValue('')
                            setSearch('')
                        }}
                    />
                </form>
                {/* //il faut aussi que loading soit a faux, dans le cas ou une
                personne a lancer un matchmaking et veux ensuite inviter un ami */}
                {search && (
                    <div className="flex flex-col gap-[20px]">
                        <div className="flex flex-col gap-[5px]  ">
                            <div className="">
                                <p className="inline underline">
                                    Choose the level
                                </p>
                                <span> :</span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="easy"
                                    checked={selectedLevel === 'easy'}
                                    onCheckedChange={() =>
                                        handleselectedLevel('easy')
                                    }
                                />
                                <label
                                    htmlFor="easy"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Easy
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="normal"
                                    checked={selectedLevel === 'normal'}
                                    onCheckedChange={() =>
                                        handleselectedLevel('normal')
                                    }
                                />
                                <label
                                    htmlFor="normal"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Normal
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="hard"
                                    checked={selectedLevel === 'hard'}
                                    onCheckedChange={() =>
                                        handleselectedLevel('hard')
                                    }
                                />
                                <label
                                    htmlFor="hard"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 "
                                >
                                    Hard
                                </label>
                            </div>
                        </div>

                        <div className="">
                            <div className="">
                                <p className="inline underline">
                                    {' '}
                                    Choose the Map{' '}
                                </p>
                                <span> :</span>
                            </div>
                            <div className="flex flex-row">
                                <div
                                    className={`realtive p-2 ${selectedMap === 'mapPingu' ? 'rounded border-4 border-blue-500 ' : ''}`}
                                    onClick={() => {
                                        if (loadingFriend !== true) {
                                            if (!selectedMap)
                                                setSelectedMap('mapPingu')
                                            else if (
                                                selectedMap === 'BasicPong'
                                            )
                                                setSelectedMap('mapPingu')
                                            else setSelectedMap('')

                                        }
                                    }}
                                >
                                    <img
                                        src={mapPingu}
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
                                    className={`realtive p-2 ${selectedMap === 'BasicPong' ? 'rounded border-4 border-blue-500 ' : ''}`}
                                    onClick={() => {
                                        if (loadingFriend !== true) {
                                            if (!selectedMap)
                                                setSelectedMap('BasicPong')
                                            else if (selectedMap === 'mapPingu')
                                                setSelectedMap('BasicPong')
                                            else setSelectedMap('')
                                        }
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
                        <div className="">
                            <form onSubmit={handleSearch}>
                                <button
                                    className="w-full  border-2 bg-blue-200 border-blue-500 rounded-xl p-2 pr-2 gap-[10px]"
                                    type="submit"
                                >
                                    {(() => {
                                        switch (friendMessage) {
                                            case 'true':
                                                return (
                                                    <p>
                                                        Cancel Invitation
                                                    </p>
                                                )
                                            case 'Error':
                                                return (
                                                    <p>
                                                        Submit (select a Level
                                                        and a Map)
                                                    </p>
                                                )
                                            case 'Error2':
                                                return (
                                                    <p>
                                                        Submit (Friend is not online or
                                                        dont exist)
                                                    </p>
                                                )
                                            case 'Error3':
                                                return (
                                                    <p>
                                                        You cannot invite
                                                        yourself
                                                    </p>
                                                )
                                            case 'Decline':
                                                return (
                                                    <p>
                                                        Submit(Your friend
                                                        decline)
                                                    </p>
                                                )
                                            default:
                                                return <p>Submit</p>
                                        }
                                    })()}
                                </button>
                            </form>
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
            {!search && (
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
                            {loading ? 'Matchmaking...(Just wait)' : 'Submit'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default GameForm
;('use client')
