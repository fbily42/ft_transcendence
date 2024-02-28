import React, { useState } from 'react'
import { LeaveChannelData, PasswordCmd } from '@/lib/Chat/chat.types'
import PinguFlag from '../../../assets/other/PinguFlag.svg'
import { Button } from '@/components/ui/button'
import { DialogClose } from '@radix-ui/react-dialog'
import { Input } from '@/components/ui/input'
import { useQuery } from '@tanstack/react-query'
import { UserData } from '@/lib/Dashboard/dashboard.types'
import { getUserMe } from '@/lib/Dashboard/dashboard.requests'
import { useForm } from 'react-hook-form'
import axios from 'axios'

type CardPasswordProps = {
    channel: string
    closeDialog: () => void
}

const CardPassword: React.FC<CardPasswordProps> = ({
    channel,
    closeDialog,
}) => {
    const { register, handleSubmit } = useForm<PasswordCmd>()
    const [errorMessage, setErrorMessage] = useState<string>('')
    const { data: me } = useQuery<UserData>({
        queryKey: ['me'],
        queryFn: getUserMe,
    })

    async function onSubmit(data: PasswordCmd) {
        data.channel = channel
        data.userId = me?.id!
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/chat/channel/password`,
                data,
                {
                    withCredentials: true,
                }
            )
            closeDialog()
        } catch (error: any) {
            setErrorMessage(error.response.data.message)
            throw error
        }
    }

    return (
        <div className="h-full w-full justify-between flex flex-col gap-[30px]">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="fixed-0">
                    <img
                        src={PinguFlag}
                        className="absolute top-[-150px] right-0"
                    />
                </div>
                <div className="flex flex-col justify-between gap-[10px]">
                    <h2 className="font-semibold">
                        Your are about to change the channel's password
                    </h2>
                    <p>Please enter the new password for your channel.</p>
                </div>
                <div className="p-[10px]">
                    <Input
                        id="password"
                        placeholder="New password"
                        type="password"
                        {...register('newPassword')}
                    ></Input>
                </div>
                <div className="text-red-600 p-[5px]">{errorMessage}</div>
                <div className="flex justify-between gap-[10px]">
                    <DialogClose asChild>
                        <Button className="w-full">Return</Button>
                    </DialogClose>
                    <Button className="w-full" type="submit">
                        Change password
                    </Button>
                </div>
            </form>
        </div>
    )
}
export default CardPassword
