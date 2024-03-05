import { useEffect, useState } from 'react'
import React, { useRef} from 'react'
import { Search } from 'lucide-react'
import { XCircle } from 'lucide-react'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import pingu_duo from './../../assets/Pong_page/duo.png'
import { useNavigate } from 'react-router-dom'
import mapPingu from '../../assets/GameForm/ImageAllGame.svg'
import BasicPong from '../../assets/GameForm/Pong_Image.svg'
import { Checkbox } from '@/components/ui/checkbox'
import { useQuery } from '@tanstack/react-query'
import { getUserMe, getUsers } from '@/lib/Dashboard/dashboard.requests'
import { UserData } from '@/lib/Dashboard/dashboard.types'

function GameForm({ closeDialog }) {
    const [search, setSearch] = useState<string>('')
    const socket = useWebSocket() as WebSocketContextType
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingFriend, setLoadingFriend] = useState<boolean>(false)
    const [friendMessage, setFriendMessage] = useState<string>('Submit')
    const currentRoom = useRef<string | null>(null)
    const currentRoomFriend = useRef<string | null>(null)
    const processingMessage = useRef<boolean>(false)
    const [inputValue, setInputValue] = useState<string>('')
    const [selectedMap, setSelectedMap] = useState<string>('mapPingu')
    const navigate = useNavigate()
    const [selectedLevel, setSelectedLevel] = useState<string>('easy')

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
        if (search === '') {
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
            if (selectedLevel === 'hard' && level === 'hard')
                setSelectedLevel('false')
            else if (selectedLevel !== 'hard' && level === 'hard')
                setSelectedLevel('hard')
        }
    }

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
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
    }

    useEffect(() => {
        if (loadingFriend === true) {
            setFriendMessage('true')
            const roomNameFriend: string = crypto.randomUUID()
            currentRoomFriend.current = roomNameFriend

            socket?.webSocket?.emit('JoinRoomFriend', {
                friend: search,
                roomId: roomNameFriend,
                level: selectedLevel,
                map: selectedMap,
            })

            socket?.webSocket?.on('JoinPartyFriend', (message: string) => {
                if (message.startsWith('Error')) {
                    setFriendMessage('Error2')
                    setLoadingFriend(false)
                } else if (message.startsWith('InGame')) {
                    setFriendMessage('InGame')
                    setLoadingFriend(false)
                } else if (message.startsWith('Go')) {
                    processingMessage.current = true
                    closeDialog()
                    navigate('/pong')
                } else if (message.startsWith('Decline')) {
                    socket?.webSocket?.emit('leaveRoomBefore', roomNameFriend)
                    setFriendMessage('Decline')
                    setSearch(inputValue)
                    setLoadingFriend(false)
                } else return
            })
        } else if (currentRoomFriend.current) {
            socket?.webSocket?.emit(
                'leaveRoomBefore',
                currentRoomFriend.current
            )
        }
        return () => {
            socket?.webSocket?.off('JoinPartyFriend')

            if (loadingFriend && !processingMessage.current) {
                setLoadingFriend(false)
                socket?.webSocket?.emit(
                    'leaveRoomBefore',
                    currentRoomFriend.current
                )
            }
        }
    }, [loadingFriend])

    const CancelMatchmaking = () => {
        setLoading(false)
        return true
    }

    useEffect(() => {
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
                } else {
                    setLoading(false)
                    return
                }
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
        <div className=" p-5 h-fit">
            <div className="fixed-0 ">
                <img
                    src={pingu_duo}
                    alt="Pingu with Robby"
                    className="absolute top-[-80px] right-0"
                />
            </div>
            <div className="bg-white h-fit">
                <p className="mb-[14px]">
                    Choose an online friend to play with{' '}
                </p>
                <form
                    onSubmit={handleFormSubmit}
                    className="w-full border-2 border-black rounded-xl p-2 pr-2 mb-4 realtive flex items-center "
                >
                    <Search className="" />
                    <div className="ml-[5px] bg-white">
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
                {search && (
                    <div className="flex flex-col gap-[10px]">
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
                                                return <p>Cancel Invitation</p>
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
                                                        Submit (Friend is not
                                                        online or doesn't exist)
                                                    </p>
                                                )
                                            case 'InGame':
                                                return (
                                                    <p>
                                                        Submit (You are already
                                                        in game)
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
            {!search && (
                <div
                    className="flex flex-col  h-full mb-[20px] justify-end gap-[20px]"
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
