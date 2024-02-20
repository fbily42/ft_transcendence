import { Message } from '@/lib/Chat/chat.types'
import Pingu from '../../../assets/empty-state/pingu-face.svg'
import React from 'react'
import { format } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'

interface MessageProps {
    message: Message
    picture: string
}

const SelfMessage: React.FC<MessageProps> = ({ message, picture }) => {
    const formattedDate = format(message.sentAt, 'hh:mm a')
    return (
        <div id="full-div" className="flex justify-end w-full">
            <div
                id="photo+message+time"
                className="flex justify-end gap-[10px] w-[50%]"
            >
                <div className="flex flex-col gap-[5px] w-fit">
                    <div id="photo+message" className="flex gap-[20px]">
                        <div
                            id="message"
                            className="bg-[#FFE6AF] p-[8px] rounded-[12px] break-words max-w-[425px]"
                        >
                            <p>{message.content}</p>
                        </div>
                        <div className="flex items-center">
                            <Avatar className="w-[48px] h-[48px]">
                                <AvatarImage
                                    className="border-[3px] border-[#F5BC41] rounded-full object-cover w-[40px] h-[40px]"
                                    src={picture}
                                />
                                <AvatarFallback>{Pingu}</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                    <div id="time" className="flex justify-start">
                        <p className="text-xs text-gray-400">{formattedDate}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelfMessage
