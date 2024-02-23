import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import Modal from '../../Modal'
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
        navigate(`?channelId=${name}`)
        socket.webSocket?.emit('leaveChannel', previousChannel)
        socket.webSocket?.emit('joinChannel', name)
    }

    useEffect(() => {
        socket?.webSocket?.on('kickedFromChannel', (channel: string) => {
            if (currentChannel === channel) {
                setCurrentChannel('')
                setHide(true)
                navigate('')
            }
        })
        socket?.webSocket?.on('activePrivateMessage', (channelName: string) => {
            const previousChannel = currentChannel
            setHide(false)
            queryClient.invalidateQueries({
                queryKey: ['channelUsers', previousChannel],
            })
            setCurrentChannel(channelName)
            navigate(`?channelId=${channelName}`)
            socket.webSocket?.emit('leaveChannel', previousChannel)
            socket.webSocket?.emit('joinChannel', channelName)
        })
        socket?.webSocket?.on('updateChannelList', () => {
            queryClient.invalidateQueries({ queryKey: ['channels'] })
        })
        socket?.webSocket?.on('hideChat', () => {
            setHide(true)
			setCurrentChannel('')
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
                        <div className="bg-customBlue flex justify-between items-center w-full h-[70px] px-[15px] sm:px-[15px] md:px-[20px] lg:px-[30px] py-[15px] sm:py-[15px] md:py-[15px] lg:py-[30px] rounded-t-[26px] md:rounded-t-[30px] lg:rounded-t-[36px]">
                            <h1 className="flex justify-start items-center h-[31px] text-base sm:text-md md:text-lg lg:text-2xl font-semibold">
                                Channels
                            </h1>
                            <Button
                                variant="ghost"
                                size="smIcon"
                                onClick={() => setOpen(true)}
                            >
                                <Plus></Plus>
                            </Button>
                            <Modal open={open} onClose={() => setOpen(false)}>
                                <TabsChannel
                                    onClose={() => setOpen(false)}
                                ></TabsChannel>
                            </Modal>
                        </div>
                        <div className="flex flex-col overflow-y-auto">
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
                        <div className="flex flex-col overflow-y-auto">
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
                                <Button
                                    variant="ghost"
                                    size="smIcon"
                                    onClick={() => setOpen2(true)}
                                >
                                    <Share></Share>
                                </Button>
                                <Modal
                                    open={open2}
                                    onClose={() => setOpen2(false)}
                                >
                                    <CardInvite
                                        channel={currentChannel}
                                        onClose={() => setOpen2(false)}
                                    ></CardInvite>
                                </Modal>
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
                <div className=" bg-white w-[290px] rounded-[36px] overflow-hidden ">
                    <div className="flex flex-col h-full">
                        <div className="bg-customBlue flex justify-between items-center w-full h-[70px] px-[15px] sm:px-[15px] md:px-[20px] lg:px-[30px] py-[15px] sm:py-[15px] md:py-[15px] lg:py-[30px] rounded-t-[26px] md:rounded-t-[30px] lg:rounded-t-[36px]">
                            <h1 className="flex justify-start items-center h-[31px] text-base sm:text-md md:text-lg lg:text-2xl font-semibold">
                                Channels
                            </h1>
                            <Button
                                variant="ghost"
                                size="smIcon"
                                onClick={() => setOpen(true)}
                            >
                                <Plus></Plus>
                            </Button>
                            <Modal open={open} onClose={() => setOpen(false)}>
                                <TabsChannel
                                    onClose={() => setOpen(false)}
                                ></TabsChannel>
                            </Modal>
                        </div>
                        <div className="flex flex-col overflow-y-auto">
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
                        <div className="flex flex-col overflow-y-auto">
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

/* 

https://react-hook-form.com/form-builder

import React from 'react';
import { useForm } from 'react-hook-form';

export default function App() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => console.log(data);
  console.log(errors);
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" placeholder="name" {...register("name", {required: true})} />
      <input type="password" placeholder="password" {...register("password", {required: true})} />
      <input type="checkbox" placeholder="private" {...register("private", {})} />

      <input type="submit" />
    </form>
  );
}

*/
