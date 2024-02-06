import React, { useEffect, useState } from 'react'
import { useWebSocket } from '@/context/webSocketContext'
import { Socket } from 'socket.io-client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { UserData } from '@/lib/Dashboard/dashboard.types'
import { getUserMe } from '@/lib/Dashboard/dashboard.requests'
import { getMessages } from '@/lib/Chat/chat.requests'
import MessageBubble from './Message'
import Placeholder from '../../../assets/empty-state/empty-chat.png'
import Modal from '@/components/Modal'
import TabsChannel from '../ChannelPanel/TabsChannel/TabsChannel'

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
    const socket = useWebSocket() as Socket
    const queryClient = useQueryClient()
    const { data: messages } = useQuery({
        queryKey: ['messages', currentChannel],
        queryFn: () => getMessages(currentChannel),
    })

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
        socket?.on('messageToRoom', messageListener)
        socket?.on('update', updateListener)
        return () => {
            socket?.off('messageToRoom', messageListener)
            socket?.off('update', updateListener)
        }
    }, [socket, messageListener])

    async function onSubmit(data: MessageFormValues) {
        const user: UserData = await queryClient.ensureQueryData({
            queryKey: ['me'],
            queryFn: getUserMe,
        })

        data.target = currentChannel
        data.userName = user.name
        data.userId = user.id
        socket?.emit('messageToRoom', data)
        reset({ message: '' })
    }

    return currentChannel ? (
        <div className="flex flex-col justify-between bg-[#C1E2F7] w-full p-[20px] rounded-[36px] shadow-drop">
            <div className="bg-white flex flex-col justify-between w-full h-full rounded-[16px] overflow-hidden p-[20px] shadow-drop">
                <div className="flex flex-col justify-end w-full h-full overflow-hidden">
                    {messages?.map((message, index) => (
                        // <span
                        //     key={index}
                        // >{`${message.sentByName}: ${message.content}`}</span>
						<MessageBubble key={index} message={message}></MessageBubble>
                    ))}
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
