import { useState } from 'react'
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
import { CreateChannelProps, CreateFormValues } from '@/lib/Chat/chat.types'
import { createChannel } from '@/lib/Chat/chat.requests'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import ChatCard from '../../../assets/other/chat-modal.svg'

interface CardCreateProps {
    onClose: () => void
}

function CardCreate({ onClose }: CardCreateProps) {
    const { register, handleSubmit } = useForm<CreateFormValues>()
    const [errorMessage, setErrorMessage] = useState<string>('')
    const queryClient = useQueryClient()
    const socket = useWebSocket() as WebSocketContextType
    const mutation = useMutation({
        mutationFn: (data: CreateChannelProps) =>
            createChannel(data.data, data.setErrorMessage, data.onClose),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['channels'] })
            socket?.webSocket?.emit('newChannel')
        },
    })

    function onSubmit(data: CreateFormValues) {
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
                        <CardTitle className="text-xl">Create</CardTitle>
                        <CardDescription>
                            Enter channel's name and set a password if you need
                            it.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1">
                            <Label htmlFor="name">Channel's Name</Label>
                            <Input
                                id="name"
                                placeholder="PinguFriends"
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
                        <div className="flex items-center space-x-2 space-y-1">
                            <input
                                type="checkbox"
                                id="private"
                                {...register('private', {})}
                            />
                            <Label
                                htmlFor="private"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Invitation only
                            </Label>
                        </div>
                        <div className="text-red-500">{errorMessage}</div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit">Create Channel</Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}

export default CardCreate
