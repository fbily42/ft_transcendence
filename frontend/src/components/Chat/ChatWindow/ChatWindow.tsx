import React, { useEffect, useState } from 'react'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
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
import TabsChannel from '../ChannelPanel/TabsChannel'
import SelfMessage from './SelfMessage'
import Pingu from '../../../assets/empty-state/pingu-face.svg'
import { getRole } from '@/lib/Chat/chat.utils'
import { useNavigate } from 'react-router-dom'

type MessageFormValues = {
    userId: string
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
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { data: messages, error: msgError } = useQuery({
        queryKey: ['messages', currentChannel],
        queryFn: () => getMessages(currentChannel),
        retry: 1,
    })

    const { data: me, error: meError } = useQuery({
        queryKey: ['me'],
        queryFn: getUserMe,
        retry: 1,
    })

    const { data: users, error: usersError } = useQuery({
        queryKey: ['channelUsers', currentChannel],
        queryFn: () => getChannelUsers(currentChannel),
        retry: 1,
    })

    function getAvatar(name: string): string {
		if (users) {
			for (const user of users) {
				if (user.name === name) {
					return user.photo42
				}
			}
		}
        return Pingu
    }

    useEffect(() => {
        socket?.webSocket?.on('messageToRoom', () => {
            queryClient.invalidateQueries({
                queryKey: ['messages', currentChannel],
            })
        })
        return () => {
            socket?.webSocket?.off('messageToRoom')
        }
    }, [socket])

    async function onSubmit(data: MessageFormValues) {
        data.target = currentChannel
        data.userName = me?.name!
        data.userId = me?.id!
        socket.webSocket?.emit('messageToRoom', data)
        reset({ message: '' })
    }

    function getSenderRole(name: string): string {
        if (users) {
            for (const user of users) {
                if (user.name === name) {
                    const role = getRole(user)
                    return role
                }
            }
        }
        return ''
    }

    useEffect(() => {
        if (
            msgError?.message.includes('403') ||
            meError?.message.includes('403') ||
            usersError?.message.includes('403')
        ) {
            navigate('/auth')
        }
    }, [msgError, meError, usersError])

    return currentChannel ? (
        <div className="flex flex-col justify-between bg-customBlue w-full p-[20px] rounded-[36px] shadow-drop">
            <div className="bg-white flex flex-col justify-between w-full h-full rounded-[16px] p-[20px] shadow-drop">
                <div className="flex flex-col-reverse gap-[36px] w-full h-full overflow-y-auto no-scrollbar">
                    {messages
                        ?.slice(0)
                        .reverse()
                        .map((message, index) =>
                            message.sentByName === me?.name ? (
                                <SelfMessage
                                    key={index}
                                    message={message}
                                    picture={me?.photo42!}
                                    role={getSenderRole(me?.name!)}
                                ></SelfMessage>
                            ) : (
                                <MessageBubble
                                    key={index}
                                    message={message}
                                    picture={getAvatar(message.sentByName)}
                                    role={getSenderRole(message.sentByName)}
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
        <div className="flex flex-col justify-between bg-customBlue w-full p-[20px] rounded-[36px] shadow-drop">
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
