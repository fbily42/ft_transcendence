import React, { useState } from 'react'
import { LeaveChannelData, UserInChannel } from '@/lib/Chat/chat.types'
import PinguFlag from '../../../assets/other/PinguFlag.svg'
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { getChannelUsers, leaveChannel } from '@/lib/Chat/chat.requests'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import { DialogClose } from '@radix-ui/react-dialog'

type LeaveChannelProps = {
    cmd: LeaveChannelData
    variant: 'Owner' | 'Other'
}

const LeaveChannel: React.FC<LeaveChannelProps> = ({ cmd, variant }) => {
    const { data: users } = useQuery<UserInChannel[]>({
        queryKey: ['channelUsers', cmd.channel],
        queryFn: () => getChannelUsers(cmd.channel),
        retry: 1,
    })

    const socket = useWebSocket() as WebSocketContextType
    const [newOwner, setNewOwner] = useState<string>('')
    const [error, setError] = useState<string>('')

    function handleClick(cmd: LeaveChannelData, newOwner: string) {
        if (!newOwner) {
            setError('Please select a new owner')
            return
        }
        cmd.newOwner = newOwner
        leaveChannel(cmd, socket)
    }

    function isAlone(): boolean {
        if (users) {
            for (const user of users) {
                if (user.member || user.muted || user.admin) return false
            }
        }
        return true
    }

    if (variant === 'Owner') {
        return (
            <div className="h-full w-full justify-between flex flex-col gap-[30px]">
                <div className="fixed-0">
                    <img
                        src={PinguFlag}
                        className="absolute top-[-150px] right-0"
                    />
                </div>
                {!isAlone() ? (
                    <>
                        <div className="flex flex-col justify-between gap-[10px]">
                            <h2 className="font-semibold">
                                Your are about to quit the channel
                            </h2>
                            <p>
                                As the channel owner, you must transfer your
                                rights to a member.
                            </p>
                            <DropdownMenuSeparator></DropdownMenuSeparator>
                        </div>
                        <div>
                            <Select
                                onValueChange={(value) => setNewOwner(value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a new owner" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {users?.map((user, index) =>
                                            user.name !== cmd.user ? (
                                                <SelectItem
                                                    key={index}
                                                    value={user.name}
                                                >
                                                    {user.pseudo}
                                                </SelectItem>
                                            ) : null
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="text-red-600">{error}</div>
                        <div className="flex justify-between gap-[10px]">
                            <DialogClose asChild>
                                <Button className="w-full">Return</Button>
                            </DialogClose>
                            <Button
                                className="w-full"
                                onClick={() => handleClick(cmd, newOwner)}
                            >
                                Transfert my rights
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex flex-col justify-between gap-[10px]">
                            <h2 className="font-semibold">
                                Your are about to quit the channel
                            </h2>
                            <p>
                                By quitting, you will also delete the channel.
                            </p>
                        </div>
                        <div className="flex justify-between gap-[10px]">
                            <DialogClose asChild>
                                <Button className="w-full">Keep channel</Button>
                            </DialogClose>
                            <Button
                                className="w-full"
                                onClick={() =>
                                    leaveChannel(
                                        { ...cmd, alone: true },
                                        socket
                                    )
                                }
                            >
                                Delete anyways
                            </Button>
                        </div>
                    </>
                )}
            </div>
        )
    } else {
        return (
            <div className="h-full w-full justify-between flex flex-col gap-[30px]">
                <div className="fixed-0">
                    <img
                        src={PinguFlag}
                        className="absolute top-[-150px] right-0"
                    />
                </div>
                <div className="flex flex-col justify-between gap-[10px]">
                    <h2 className="font-semibold">
                        Your are about to quit the channel
                    </h2>
                    <p>
                        Once you confirm, you will no longer have access to the
                        chat.
                    </p>
                </div>
                <div className="flex justify-between gap-[10px]">
                    <Button
                        className="w-full"
                        onClick={() => leaveChannel(cmd, socket)}
                    >
                        Quit channel
                    </Button>
                    <DialogClose asChild>
                        <Button className="w-full">Keep chatting</Button>
                    </DialogClose>
                </div>
            </div>
        )
    }
}
export default LeaveChannel
