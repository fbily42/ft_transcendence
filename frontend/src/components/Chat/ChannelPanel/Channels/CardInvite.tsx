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
import { Label } from '@radix-ui/react-label'
import axios from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

type InviteFormValues = {
    name: string
    channel: string
}

interface CardInviteProps {
    onClose: () => void
    channel: string
}

const CardInvite: React.FC<CardInviteProps> = ({ onClose, channel }) => {
    const { register, handleSubmit } = useForm<InviteFormValues>()
    const [errorMessage, setErrorMessage] = useState<string>('')

    async function onSubmit(data: InviteFormValues) {
        data.channel = channel
		//call to back to change user status in db
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/chat/channel/invite`,
                data,
                {
                    withCredentials: true,
                }
            )
			//socket event with name+channel to toast the user
			onClose()
        } catch (error: any) {
			setErrorMessage(error.response.data.message)
			throw error
		}
    }

    return (
        <div>
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
