import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import Modal from '../../Modal'
import TabsChannel from './Channels/TabsChannel'
import UserCards from '@/components/User/userCards/UserCards'
import { getChannels } from '@/lib/Chat/chat.requests'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Share } from 'lucide-react'
import PinguFamily from '../../../assets/empty-state/pingu-family.svg'
import UserList from './Channels/UserList'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import { Socket } from 'socket.io-client'
import CardInvite from './Channels/CardInvite'

interface ChannelPanelProps {
    setCurrentChannel: React.Dispatch<React.SetStateAction<string>>
    currentChannel: string
}

const ChannelPanel: React.FC<ChannelPanelProps> = ({
    setCurrentChannel,
    currentChannel,
}) => {
    const [open, setOpen] = useState<boolean>(false)
    const [open2, setOpen2] = useState<boolean>(false)

    const [hide, setHide] = useState<boolean>(true)
    const [color, setColor] = useState<string>('')
    const queryClient = useQueryClient()
    const socket = useWebSocket() as WebSocketContextType

    const { data: channels } = useQuery({
        queryKey: ['channels'],
        queryFn: getChannels,
    })

    function handleClick(name: string) {
        const previousChannel = currentChannel
        setHide(false)
        setCurrentChannel(name)
        queryClient.invalidateQueries({
            queryKey: ['channelUsers', previousChannel],
        })
        setColor('[#C1E2F7]')
        socket.webSocket?.emit('leaveChannel', previousChannel)
        socket.webSocket?.emit('joinChannel', name)
    }

    if (!hide) {
        return (
            <div className="flex h-full inner-block">
                <div className=" bg-white w-[150px] lg:w-[290px] rounded-[36px] overflow-hidden shadow-drop">
                    <div className="bg-[#C1E2F7] flex justify-between items-center w-full h-[70px] px-[15px] sm:px-[15px] md:px-[20px] lg:px-[30px] py-[15px] sm:py-[15px] md:py-[15px] lg:py-[30px] rounded-t-[26px] md:rounded-t-[30px] lg:rounded-t-[36px]">
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
                    <div className="bg-pink-200">
                        <h1 className="p-[4px]">Private Messages</h1>
                    </div>
                    <div className="bg-blue-200">
                        <div className="justify-between">
                            <h1 className="p-[4px]">Groups</h1>
                            {channels?.map((channel, index) =>
                                !channel.banned && !channel.invited ? (
                                    <div
                                        key={index}
                                        onClick={() =>
                                            handleClick(channel.name)
                                        }
                                        className="hover:cursor-pointer"
                                    >
                                        <UserCards
                                            bgColor={
                                                channel.name === currentChannel
                                                    ? color
                                                    : 'white'
                                            }
                                            userName={channel.name}
                                            userPicture={PinguFamily}
                                            userStatus=""
                                            variant="CHAT"
                                        ></UserCards>
                                    </div>
                                ) : null
                            )}
                        </div>
                    </div>
                </div>
                <div className="bg-[#C1E2F7] w-[150px] lg:w-[290px] rounded-[36px] overflow-hidden shadow-drop">
                    <div className="bg-[#C1E2F7] flex justify-between items-center w-full h-[70px] px-[15px] sm:px-[15px] md:px-[20px] lg:px-[30px] py-[15px] sm:py-[15px] md:py-[15px] lg:py-[30px] rounded-t-[26px] md:rounded-t-[30px] lg:rounded-t-[36px]">
                        <h1 className="flex justify-start items-center h-[31px] text-base sm:text-md md:text-lg lg:text-2xl font-semibold">
                            {currentChannel}
                        </h1>
                        <Button
                            variant="ghost"
                            size="smIcon"
                            onClick={() => setOpen2(true)}
                        >
                            <Share></Share>
                        </Button>
                        <Modal open={open2} onClose={() => setOpen2(false)}>
                            <CardInvite
                                channel={currentChannel}
                                onClose={() => setOpen2(false)}
                            ></CardInvite>
                        </Modal>
                    </div>
                    <UserList channel={currentChannel}></UserList>
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex h-full inner-block">
                <div className=" bg-white w-[290px] rounded-[36px] overflow-hidden ">
                    <div className="bg-[#C1E2F7] flex justify-between items-center w-full h-[70px] px-[15px] sm:px-[15px] md:px-[20px] lg:px-[30px] py-[15px] sm:py-[15px] md:py-[15px] lg:py-[30px] rounded-t-[26px] md:rounded-t-[30px] lg:rounded-t-[36px]">
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
                    <div className="bg-pink-200">
                        <h1 className="ml-4">Private Messages</h1>
                    </div>
                    <div className="bg-blue-200">
                        <div className="justify-between overflow-auto-y">
                            <h1 className="ml-4">Groups</h1>
                            {channels?.map((channel, index) =>
                                !channel.banned && !channel.invited ? (
                                    <div
                                        key={index}
                                        onClick={() =>
                                            handleClick(channel.name)
                                        }
                                    >
                                        <UserCards
                                            bgColor="white"
                                            userName={channel.name}
                                            userPicture={PinguFamily}
                                            userStatus=""
                                            variant="CHAT"
                                        ></UserCards>
                                    </div>
                                ) : null
                            )}
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
