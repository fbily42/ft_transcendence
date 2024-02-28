import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import TabsChannel from './TabsChannel'
import { getChannels } from '@/lib/Chat/chat.requests'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Share } from 'lucide-react'
import UserList from './UserList'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import CardInvite from './CardInvite'
import { getDirectName } from '@/lib/Chat/chat.utils'
import { getUserMe } from '@/lib/Dashboard/dashboard.requests'
import { useNavigate } from 'react-router-dom'
import { UserData } from '@/lib/Dashboard/dashboard.types'
import { Channel } from '@/lib/Chat/chat.types'
import CardChannel from './CardChannel'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import Floe from '../../../assets/other/mountain.svg'

interface ChannelPanelProps {
    setCurrentChannel: React.Dispatch<React.SetStateAction<string>>
    currentChannel: string
}

const ChannelPanel: React.FC<ChannelPanelProps> = ({
    setCurrentChannel,
    currentChannel,
}) => {
    const navigate = useNavigate()
    const [open, setOpen] = useState<boolean>(false)
    const [open2, setOpen2] = useState<boolean>(false)
    const [hide, setHide] = useState<boolean>(true)
    const queryClient = useQueryClient()
    const socket = useWebSocket() as WebSocketContextType

    const { data: channels, error: channelError } = useQuery<Channel[]>({
        queryKey: ['channels'],
        queryFn: getChannels,
        retry: 1,
    })

    const { data: me, error: meError } = useQuery<UserData>({
        queryKey: ['me'],
        queryFn: getUserMe,
        retry: 1,
    })

    function clickPrivateMessage(name: string) {
        setHide(true)
        handleClick(name)
    }

    function clickGroups(name: string) {
        setHide(false)
        handleClick(name)
    }

    function handleClick(name: string) {
        const previousChannel = currentChannel
        setCurrentChannel(name)
        queryClient.invalidateQueries({
            queryKey: ['channelUsers', previousChannel],
        })
        socket.webSocket?.emit('leaveChannel', previousChannel)
        socket.webSocket?.emit('joinChannel', name)
    }

    useEffect(() => {
        socket?.webSocket?.on('kickedFromChannel', (channel: string) => {
            if (currentChannel === channel) {
                setCurrentChannel('')
                setHide(true)
            }
        })
        socket?.webSocket?.on('activePrivateMessage', (channelName: string) => {
            const previousChannel = currentChannel
            setHide(true)
            queryClient.invalidateQueries({
                queryKey: ['channelUsers', previousChannel],
            })
            setCurrentChannel(channelName)
            socket.webSocket?.emit('leaveChannel', previousChannel)
            socket.webSocket?.emit('joinChannel', channelName)
        })
        socket?.webSocket?.on('updateChannelList', () => {
            queryClient.invalidateQueries({ queryKey: ['channels'] })
        })
        socket?.webSocket?.on('hideChat', () => {
            setCurrentChannel('')
            setHide(true)
        })
        return () => {
            socket?.webSocket?.off('kickedFromChannel')
            socket?.webSocket?.off('activePrivateMessage')
            socket?.webSocket?.off('updateChannelList')
            socket?.webSocket?.off('hideChat')
        }
    })

    useEffect(() => {
        if (
            meError?.message.includes('403') ||
            channelError?.message.includes('403')
        ) {
            navigate('/auth')
        }
    }, [channelError, meError])

    if (!hide) {
        return (
            <div className="flex h-full inner-block">
                <div className=" bg-white w-[150px] lg:w-[290px] rounded-[36px] overflow-hidden shadow-drop">
                    <div className="flex flex-col h-full">
                        <div className="bg-customBlue relative flex justify-between items-center w-full h-[70px] px-[15px] sm:px-[15px] md:px-[20px] lg:px-[30px] py-[15px] sm:py-[15px] md:py-[15px] lg:py-[30px] rounded-t-[26px] md:rounded-t-[30px] lg:rounded-t-[36px]">
                            <h1 className="flex justify-start items-center h-[31px] text-base sm:text-md md:text-lg lg:text-2xl font-semibold z-10">
                                Channels
                            </h1>
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="smIcon"
                                        className="z-10"
                                    >
                                        <Plus></Plus>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <TabsChannel
                                        onClose={() => setOpen(false)}
                                    ></TabsChannel>
                                </DialogContent>
                            </Dialog>
                            <img
                                src={Floe}
                                className="absolute -bottom-3 left-0"
                            />
                        </div>
                        <div className="flex flex-col overflow-y-auto no-scrollbar">
                            <h1 className="p-[20px] text-gray-500">
                                Private Messages
                            </h1>
                            <div className="flex flex-col overflow-y-auto no-scrollbar">
                                {channels?.map((channel, index) =>
                                    channel.direct ? (
                                        <div
                                            key={index}
                                            onClick={() =>
                                                clickPrivateMessage(
                                                    channel.name
                                                )
                                            }
                                            className="hover:cursor-pointer"
                                        >
                                            <CardChannel
                                                channelName={channel.name}
                                                variant="PrivateMessage"
                                                bgColor={
                                                    channel.name ===
                                                    currentChannel
                                                        ? 'bg-customBlue'
                                                        : 'bg-white'
                                                }
                                            ></CardChannel>
                                        </div>
                                    ) : null
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col overflow-y-auto no-scrollbar">
                            <h1 className="p-[20px] text-gray-500">Groups</h1>
                            <div className="flex flex-col overflow-y-auto no-scrollbar">
                                {channels?.map((channel, index) =>
                                    !channel.banned &&
                                    !channel.invited &&
                                    !channel.direct ? (
                                        <div
                                            key={index}
                                            onClick={() =>
                                                clickGroups(channel.name)
                                            }
                                            className="hover:cursor-pointer"
                                        >
                                            <CardChannel
                                                channelName={channel.name}
                                                variant="Groups"
                                                bgColor={
                                                    channel.name ===
                                                    currentChannel
                                                        ? 'bg-customBlue'
                                                        : 'bg-white'
                                                }
                                            ></CardChannel>
                                        </div>
                                    ) : null
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-customBlue w-[150px] lg:w-[290px] rounded-[36px] overflow-hidden shadow-drop">
                    <div className="bg-customBlue flex justify-between items-center w-full h-[70px] px-[15px] sm:px-[15px] md:px-[20px] lg:px-[30px] py-[15px] sm:py-[15px] md:py-[15px] lg:py-[30px] rounded-t-[26px] md:rounded-t-[30px] lg:rounded-t-[36px]">
                        <h1 className="flex justify-start items-center h-[31px] text-base sm:text-md md:text-lg lg:text-2xl font-semibold">
                            {getDirectName(currentChannel, me?.name!)}
                        </h1>
                        {getDirectName(currentChannel, me?.name!) ===
                        currentChannel ? (
                            <div>
                                <Dialog open={open2} onOpenChange={setOpen2}>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="smIcon">
                                            <Share></Share>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <img
                                            src={Floe}
                                            className="absolute -bottom-3 left-0"
                                        />
                                        <CardInvite
                                            channel={currentChannel}
                                            onClose={() => setOpen2(false)}
                                        ></CardInvite>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        ) : null}
                    </div>
                    <UserList channel={currentChannel}></UserList>
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex h-full inner-block">
                <div className=" bg-white w-[290px] rounded-[36px] overflow-hidden">
                    <div className="flex flex-col h-full">
                        <div className="bg-customBlue relative flex justify-between items-center w-full h-[70px] px-[15px] sm:px-[15px] md:px-[20px] lg:px-[30px] py-[15px] sm:py-[15px] md:py-[15px] lg:py-[30px] rounded-t-[26px] md:rounded-t-[30px] lg:rounded-t-[36px]">
                            <h1 className="flex justify-start items-center h-[31px] text-base sm:text-md md:text-lg lg:text-2xl font-semibold z-10">
                                Channels
                            </h1>
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="smIcon">
                                        <Plus></Plus>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <TabsChannel
                                        onClose={() => setOpen(false)}
                                    ></TabsChannel>
                                </DialogContent>
                            </Dialog>
                            <img
                                src={Floe}
                                className="absolute -bottom-3 left-0"
                            />
                        </div>
                        <div className="flex flex-col overflow-y-auto no-scrollbar">
                            <h1 className="p-[20px] text-gray-500">
                                Private Messages
                            </h1>
                            <div className="flex flex-col overflow-y-auto no-scrollbar">
                                {channels?.map((channel, index) =>
                                    channel.direct ? (
                                        <div
                                            key={index}
                                            onClick={() =>
                                                clickPrivateMessage(
                                                    channel.name
                                                )
                                            }
                                            className="hover:cursor-pointer"
                                        >
                                            <CardChannel
                                                channelName={channel.name}
                                                variant="PrivateMessage"
                                                bgColor={
                                                    channel.name ===
                                                    currentChannel
                                                        ? 'bg-customBlue'
                                                        : 'bg-white'
                                                }
                                            ></CardChannel>
                                        </div>
                                    ) : null
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col overflow-y-auto no-scrollbar">
                            <h1 className="p-[20px] text-gray-500">Groups</h1>
                            <div className="flex flex-col overflow-y-auto no-scrollbar">
                                {channels?.map((channel, index) =>
                                    !channel.banned &&
                                    !channel.invited &&
                                    !channel.direct ? (
                                        <div
                                            key={index}
                                            onClick={() =>
                                                clickGroups(channel.name)
                                            }
                                        >
                                            <CardChannel
                                                channelName={channel.name}
                                                variant="Groups"
                                                bgColor={
                                                    channel.name ===
                                                    currentChannel
                                                        ? 'bg-customBlue'
                                                        : 'white'
                                                }
                                            ></CardChannel>
                                        </div>
                                    ) : null
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChannelPanel
