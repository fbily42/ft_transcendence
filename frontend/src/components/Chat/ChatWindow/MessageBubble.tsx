import { Message } from '@/lib/Chat/chat.types'
import Pingu from '../../../assets/empty-state/pingu-face.svg'
import React from 'react'
import { format } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import {
    getAvatarBorderColor,
    getMessageBorderColor,
} from '@/lib/Chat/chat.utils'

interface MessageProps {
    pseudo: string
    message: Message
    picture: string
    role: string
    blocked: boolean
}

const MessageBubble: React.FC<MessageProps> = ({
    pseudo,
    message,
    picture,
    role,
    blocked,
}) => {
    const formattedDate = format(message.sentAt, 'hh:mm a')

    return role === 'banned' || blocked ? (
        <div id="full-div" className="flex w-full">
            <div id="photo+message+time" className="flex gap-[10px] w-[50%]">
                <div className="flex flex-col gap-[5px] w-fit">
                    <div id="photo+message" className="flex gap-[10px]">
                        <div className="flex items-center">
                            <Avatar className="w-[48px] h-[48px]">
                                <AvatarImage
                                    className={`border-[3px] ${getAvatarBorderColor(role)} rounded-full object-cover w-[40px] h-[40px]`}
                                    src={Pingu}
                                />
                                <AvatarFallback>{Pingu}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div
                            id="message"
                            className={`flex-col gap-[10px] p-[8px] border-[3px] rounded-[12px] ${getMessageBorderColor(role)}`}
                        >
                            <p className="font-bold">unknown</p>
                            <p>This person has been banned or blocked</p>
                        </div>
                    </div>
                    <div id="time" className="flex justify-end">
                        <p className="text-xs text-gray-400">{formattedDate}</p>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div id="full-div" className="flex w-full">
            <div id="photo+message+time" className="flex gap-[10px] w-[50%]">
                <div className="flex flex-col gap-[5px] w-fit">
                    <div id="photo+message" className="flex gap-[10px]">
                        <div className="flex items-center">
                            <Avatar className="w-[48px] h-[48px]">
                                <AvatarImage
                                    className={`border-[3px] ${getAvatarBorderColor(role)} rounded-full object-cover w-[40px] h-[40px]`}
                                    src={picture}
                                />
                                <AvatarFallback>{Pingu}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div
                            id="message"
                            className={`flex-col gap-[10px] p-[8px] border-[3px] rounded-[12px] ${getMessageBorderColor(role)} break-words max-w-[425px]`}
                        >
                            <p className="font-bold">{pseudo}</p>
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
