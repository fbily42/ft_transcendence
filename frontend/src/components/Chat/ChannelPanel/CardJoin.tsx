import React, { useState } from 'react'
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
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { JoinChannelProps, JoinFormValues } from '@/lib/Chat/chat.types'
import { joinChannel } from '@/lib/Chat/chat.requests'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import ChatCard from '../../../assets/other/chat-modal.svg'

interface CardJoinProps {
    onClose: () => void
}

function CardJoin({ onClose }: CardJoinProps) {
    const { register, handleSubmit } = useForm<JoinFormValues>()
    const [errorMessage, setErrorMessage] = useState<string>('')
    const socket = useWebSocket() as WebSocketContextType
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: (data: JoinChannelProps) =>
            joinChannel(data.data, data.setErrorMessage, data.onClose),
        onSuccess: (_, data) => {
            queryClient.invalidateQueries({ queryKey: ['channels'] })
            socket?.webSocket?.emit('newChannelUser', data.data.name)
        },
    })

    function onSubmit(data: JoinFormValues) {
        mutation.mutate({ data, setErrorMessage, onClose })
    }

    return (
        <div className="h-full w-full justify-between flex flex-col gap-[10px]">
            <div className="fixed-0">
                <img src={ChatCard} className="absolute top-[-100px]" />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card className="border-none shadow-none">
                    <CardHeader>
                        <CardTitle className="text-xl">Join</CardTitle>
                        <CardDescription>
                            Enter channel's informations to join it.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="name">Channel's name</Label>
                            <Input
                                id="name"
                                placeholder="PingaFriends"
                                {...register('name')}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                placeholder="Optional"
                                type="password"
                                {...register('password', {
                                    setValueAs: (value) =>
                                        value === '' ? undefined : value,
                                })}
                            />
                        </div>
                        <div className="text-red-600">{errorMessage}</div>
                    </CardContent>
                    <CardFooter>
                        <Button>Join Channel</Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}

export default CardJoin
