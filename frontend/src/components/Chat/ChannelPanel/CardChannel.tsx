import React, { useEffect } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import PinguFamily from '../../../assets/empty-state/pingu-family.svg'
import Pingu from '../../../assets/empty-state/pingu-face.svg'
import DropdownChannel from './DropdownChannel'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { UserInChannel } from '@/lib/Chat/chat.types'
import { UserData } from '@/lib/Dashboard/dashboard.types'
import { getChannelUsers } from '@/lib/Chat/chat.requests'
import { getUserMe } from '@/lib/Dashboard/dashboard.requests'
import { getMyrole } from '@/lib/Chat/chat.utils'

interface CardChannel {
    channelName: string
    bgColor: string
    variant: 'PrivateMessage' | 'Groups'
}

const CardChannel: React.FC<CardChannel> = ({
    channelName,
    variant,
    bgColor,
}) => {
    const socket = useWebSocket() as WebSocketContextType
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { data: users, error: usersError } = useQuery<UserInChannel[]>({
        queryKey: ['channelUsers', channelName],
        queryFn: () => getChannelUsers(channelName),
        retry: 1,
    })

    const { data: me, error: meError } = useQuery<UserData>({
        queryKey: ['me'],
        queryFn: getUserMe,
        retry: 1,
    })

    useEffect(() => {
        socket.webSocket?.on('updateChannelUsers', () => {
            queryClient.invalidateQueries({
                queryKey: ['channelUsers', channelName],
            })
        })
        return () => {
            socket.webSocket?.off('updateChannelUsers')
        }
    }, [socket])

    useEffect(() => {
        if (
            meError?.message.includes('403') ||
            usersError?.message.includes('403')
        ) {
            navigate('/auth')
        }
    }, [usersError, meError])

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

    return (
        <div className="h-full w-full">
            <Card
                className={`flex items-center px-[6px] sm:px-[16px] md:px-[26px] h-[68px] ${bgColor} w-full rounded-none shadow-none border-none justify-between`}
            >
                <div className="flex items-center h-full w-full gap-[10px] md:gap-[20px]">
                    {variant === 'Groups' ? (
                        <Avatar className="w-[48px] h-[48px]">
                            <AvatarImage
                                className="rounded-full object-cover w-[40px] h-[40px] border-[3px] border-customDarkBlue"
                                src={PinguFamily}
                            />
                            <AvatarFallback>{PinguFamily}</AvatarFallback>
                        </Avatar>
                    ) : (
                        <Avatar className="w-[48px] h-[48px]">
                            <AvatarImage
                                className="rounded-full object-cover w-[40px] h-[40px] border-[3px] border-customDarkBlue"
                                src={getAvatar(channelName)}
                            />
                            <AvatarFallback>{Pingu}</AvatarFallback>
                        </Avatar>
                    )}
                    <CardHeader className="w-full h-full flex justify-center p-0">
                        <CardTitle>{channelName}</CardTitle>
                    </CardHeader>
                </div>
                <div>
                    {variant === 'Groups' ? (
                        <DropdownChannel
                            userName={me?.name!}
                            channelName={channelName}
                            role={getMyrole(me?.name!, users!)}
                        />
                    ) : null}
                </div>
            </Card>
        </div>
    )
}

export default CardChannel
