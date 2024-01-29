import React, { useEffect, useState } from 'react'
import Messages from './Messages'
import { useWebSocket } from '@/context/webSocketContext'
import { Socket } from 'socket.io-client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import { UserData } from '@/lib/Dashboard/dashboard.types'

type MessageFormValues = {
    userId: number
    userName: string
    target: string
    message: string
}

type Message = {
    sentAt: Date
    userId: number
    userName: string
    target: string
    message: string
}

interface ChatWindowProps {
    currentChannel: string
}

const ChatWindow: React.FC<ChatWindowProps> = ({ currentChannel }) => {
    const { register, handleSubmit } = useForm<MessageFormValues>()
    const socket = useWebSocket() as Socket
    const [messages, setMessages] = useState<Message[]>([])
    const queryClient = useQueryClient()
    const user = queryClient.getQueryData<UserData>(['me'])
    //Send an event 'message' to WebSocket with value as argument
    const send = (value: string) => {
        socket?.emit('message', value)
    }

    //Save the message in a string array
    const messageListener = (message: Message) => {
        setMessages([...messages, message])
    }

    //On = Listen to the event 'message' then call messageListener() with the given arguments
    //Off = Stop listenning when component is unmount
    useEffect(() => {
        socket?.on('messageToRoom', messageListener)
        return () => {
            socket?.off('message', messageListener)
        }
    }, [socket, messageListener])

    function onSubmit(data: MessageFormValues) {
        data.target = currentChannel
        data.userName = user?.name || ''
    }

    return (
        <div className="flex flex-col justify-between bg-[#C1E2F7] w-full p-[20px] rounded-[36px] shadow-drop">
            <div className="bg-white flex flex-col justify-between w-full h-full rounded-[16px] overflow-hidden p-[20px] shadow-drop">
                <div className=" w-full h-full overflow-hidden">
                    {/* <Messages messages={messages}></Messages> */}
                </div>
                <div className="flex w-full items-center space-x-2 border-t-[#E5E5EA] border-t-[1px] pt-[20px]">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            className="shadow-none border-none focus-visible:ring-0"
                            type="text"
                            placeholder="Send message..."
                            {...register('message')}
                        />
                        <Button variant={'ghost'} size={'smIcon'} type="submit">
                            <Send />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ChatWindow

/* 
                    <input
                        type="text"
                        className="p-4 w-full"
                        placeholder="Send a message"
                        onChange={(e) => setValue(e.target.value)}
                        value={value}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                send(value)
                                setValue('')
                            }
                        }}
                    />
*/
