import { Message } from '@/lib/Chat/chat.types'
import Pingu from '../../../assets/empty-state/pingu-face.svg'
import React from 'react'
import { format } from 'date-fns'

interface MessageProps {
    message: Message
}

const MessageBubble: React.FC<MessageProps> = ({ message }) => {
    const formattedDate = format(message.sentAt, 'hh:mm a')
    return (
        <div id="full-div" className="flex flex-row bg-red-300 w-full">
            <div
                id="photo+message+time"
                className="bg-pink-300 flex flex-col justify-between gap-[10px] w-[50%]"
            >
                <div id="photo+message" className="bg-blue-100 flex gap-[10px]">
                    <img src={Pingu}></img>
                    <div
                        id="message"
                        className="bg-blue-300 flex-col gap-[10px] border-4"
                    >
                        <p>{message.sentByName}</p>
                        <p>{message.content}</p>
                    </div>
                </div>
                <div id="time" className="bg-yellow-300 flex justify-end">
                    {formattedDate}
                </div>
            </div>
        </div>
    )
}

export default MessageBubble
