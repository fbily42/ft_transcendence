import React, { useEffect, useState } from 'react'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import { Socket } from 'socket.io-client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getUserMe } from '@/lib/Dashboard/dashboard.requests'
import { getChannelUsers, getMessages } from '@/lib/Chat/chat.requests'
import MessageBubble from './MessageBubble'
import Placeholder from '../../../assets/empty-state/empty-chat.png'
import Modal from '@/components/Modal'
import TabsChannel from '../ChannelPanel/Channels/TabsChannel'
import SelfMessage from './SelfMessage'
import Pingu from '../../../assets/empty-state/pingu-face.svg'

type MessageFormValues = {
    userId: number
    userName: string
    target: string
    message: string
}

interface ChatWindowProps {
    currentChannel: string
}

const ChatWindow: React.FC<ChatWindowProps> = ({ currentChannel }) => {
    const [open, setOpen] = useState<boolean>(false)
    const { register, handleSubmit, reset } = useForm<MessageFormValues>()
    const socket = useWebSocket() as WebSocketContextType
    const queryClient = useQueryClient()

    const { data: messages } = useQuery({
        queryKey: ['messages', currentChannel],
        queryFn: () => getMessages(currentChannel),
    })

    const { data: me } = useQuery({
        queryKey: ['me'],
        queryFn: getUserMe,
    })

    const { data: users } = useQuery({
        queryKey: ['channelUsers', currentChannel],
        queryFn: () => getChannelUsers(currentChannel),
    })

    function getAvatar(name: string): string {
        for (const user of users || []) {
            if (user.name === name) {
                return user.photo42
            }
        }
        return Pingu
    }

    //Call for each event 'newMessage' and invalidate the query 'messages' to update it
    const messageListener = (message: string) => {
        if (message === 'newMessage')
            queryClient.invalidateQueries({
                queryKey: ['messages', currentChannel],
            })
    }

    const updateListener = () => {
        queryClient.invalidateQueries({
            queryKey: ['channelUsers', currentChannel],
        })
    }

    //On = Listen to the event 'message' then call messageListener() with the given arguments
    //Off = Stop listenning when component is unmount
    useEffect(() => {
        socket.webSocket?.on('messageToRoom', messageListener)
        socket.webSocket?.on('update', updateListener)
        return () => {
            socket.webSocket?.off('messageToRoom', messageListener)
            socket.webSocket?.off('update', updateListener)
        }
    }, [socket, messageListener, updateListener])

    async function onSubmit(data: MessageFormValues) {
        data.target = currentChannel
        data.userName = me?.name || ''
        data.userId = me?.id || 0
        socket.webSocket?.emit('messageToRoom', data)
        reset({ message: '' })
    }

    return currentChannel ? (
        <div className="flex flex-col justify-between bg-[#C1E2F7] w-full p-[20px] rounded-[36px] shadow-drop">
            <div className="bg-white flex flex-col justify-between w-full h-full rounded-[16px] p-[20px] shadow-drop">
                <div className="flex flex-col-reverse gap-[36px] w-full h-full overflow-y-auto">
                    {messages
                        ?.slice(0)
                        .reverse()
                        .map((message, index) =>
                            message.sentByName === me?.name ? (
                                <SelfMessage
                                    key={index}
                                    message={message}
                                    picture={me?.photo42 || ''}
                                ></SelfMessage>
                            ) : (
                                <MessageBubble
                                    key={index}
                                    message={message}
                                    picture={getAvatar(message.sentByName)}
                                ></MessageBubble>
                            )
                        )}
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex w-full items-center space-x-2 border-t-[#E5E5EA] border-t-[1px] pt-[20px]">
                        <Input
                            className="shadow-none border-none focus-visible:ring-0"
                            type="text"
                            placeholder="Send message..."
                            {...register('message')}
                        />
                        <Button variant={'ghost'} size={'smIcon'} type="submit">
                            <Send />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    ) : (
        <div className="flex flex-col justify-between bg-[#C1E2F7] w-full p-[20px] rounded-[36px] shadow-drop">
            <div className="bg-white flex flex-col justify-center items-center w-full h-full rounded-[16px] overflow-hidden p-[20px] shadow-drop">
                <img className="w-[80%]" src={Placeholder}></img>
                <Button
                    className="w-[10%] justify-between bg-customYellow"
                    onClick={() => setOpen(true)}
                >
                    <span>Noot chat</span>
                    <Plus />
                </Button>
                <Modal open={open} onClose={() => setOpen(false)}>
                    <TabsChannel onClose={() => setOpen(false)}></TabsChannel>
                </Modal>
            </div>
        </div>
    )
}

export default ChatWindow
