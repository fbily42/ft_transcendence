import React from 'react'
import { LeaveChannelData } from '@/lib/Chat/chat.types'
import PinguFlag from '../../../assets/other/PinguFlag.svg'
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

type LeaveChannelProps = {
    cmd: LeaveChannelData
    variant: 'Owner' | 'Other'
}

const LeaveChannel: React.FC<LeaveChannelProps> = ({ cmd, variant }) => {
    if (variant === 'Owner') {
        return (
            <div className="h-full w-full justify-between flex flex-col gap-[30px]">
                <div className="fixed-0">
                    <img
                        src={PinguFlag}
                        className="absolute top-[-150px] right-0"
                    />
                </div>
                <div className="flex flex-col justify-between">
                    <h2 className="font-semibold">
                        Your are about to quit the channel
                    </h2>
                    <p>
                        As the channel owner, you must transfer your rights to a
                        member.
                    </p>
                    <DropdownMenuSeparator></DropdownMenuSeparator>
                </div>
                <div className="">
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a new owner" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="apple">Apple</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex justify-between gap-[10px]">
                    <Button className="w-full">Return</Button>
                    <Button className="w-full">Transfert my rights</Button>
                </div>
            </div>
        )
    } else {
        return (
            <div className="h-full w-full bg-customBlue">
                <div className="fixed-0">
                    <img
                        src={PinguFlag}
                        className="absolute top-[-80px] right-0"
                    />
                </div>
                You are about to leave this channel
            </div>
        )
    }
}
export default LeaveChannel
