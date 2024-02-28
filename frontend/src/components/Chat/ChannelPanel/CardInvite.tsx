import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import { CardInviteProps, InviteFormValues } from '@/lib/Chat/chat.types'
import { getUserMe } from '@/lib/Dashboard/dashboard.requests'
import { Label } from '@radix-ui/react-label'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import ChatCard from '../../../assets/other/chat-modal.svg'

const CardInvite: React.FC<CardInviteProps> = ({ onClose, channel }) => {
    const { register, handleSubmit } = useForm<InviteFormValues>()
    const [errorMessage, setErrorMessage] = useState<string>('')
    const socket = useWebSocket() as WebSocketContextType
    const { data: me } = useQuery({ queryKey: ['me'], queryFn: getUserMe })

    async function onSubmit(data: InviteFormValues) {
        data.channel = channel
        data.sentBy = me?.pseudo!
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/chat/channel/invite`,
                data,
                {
                    withCredentials: true,
                }
            )
            data.name = response.data
            socket.webSocket?.emit('channelInvite', data)
            onClose()
        } catch (error: any) {
            setErrorMessage(error.response.data.message)
            throw error
        }
    }

    return (
        <div className="h-full w-full justify-between flex flex-col gap-[10px]">
            <div className="fixed-0">
                <img src={ChatCard} className="absolute top-[-100px]" />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card className="border-none shadow-none">
                    <CardHeader>
                        <CardTitle>Invite to channel</CardTitle>
                        <CardDescription>
                            Enter noot's name to invite him in this channel.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Pingu"
                                {...register('name')}
                            />
                        </div>
                        <div className="text-red-600">{errorMessage}</div>
                    </CardContent>
                    <CardFooter>
                        <Button>Invite to channel</Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}

export default CardInvite
