import { Message } from '@/lib/Chat/chat.types'
import Pingu from '../../../assets/empty-state/pingu-face.svg'
import React from 'react'
import { format } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { getBorderColor } from '@/lib/Chat/chat.utils'

interface MessageProps {
    message: Message
    picture: string
	role: string
}

const MessageBubble: React.FC<MessageProps> = ({ message, picture, role }) => {
    const formattedDate = format(message.sentAt, 'hh:mm a')
    return (
        <div id="full-div" className="flex w-full">
            <div
                id="photo+message+time"
                className="flex gap-[10px] w-[50%]"
            >
                <div className="flex flex-col gap-[5px] w-fit">
                    <div
                        id="photo+message"
                        className="flex gap-[10px]"
                    >
                        <div className="flex items-center">
                            <Avatar className="w-[48px] h-[48px]">
                                <AvatarImage
                                    className={`border-[3px] ${getBorderColor(role)} rounded-full object-cover w-[40px] h-[40px]`}
                                    src={picture}
                                />
                                <AvatarFallback>{Pingu}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div
                            id="message"
                            className={`flex-col gap-[10px] p-[8px] border-[3px] rounded-[12px] ${getBorderColor(role)}`}
                        >
                            <p className="font-bold">{message.sentByName}</p>
                            <p>{message.content}</p>
                        </div>
                    </div>
                    <div id="time" className="flex justify-end">
                        <p className="text-xs text-gray-400">{formattedDate}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MessageBubble
