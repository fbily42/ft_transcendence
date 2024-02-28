import React, { useState } from 'react'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import PinguAvatar from '../../../assets/empty-state/pingu-face.svg'
import DropdownChannelUser from './DropdownChannelUser'
import { getAvatarBorderColor, getTextColor } from '@/lib/Chat/chat.utils'

interface CardChannelUser {
    targetPseudo: string
    targetId: string
    targetPicture: string
    targetName: string
    targetRole: string
    userRole: string
	channel: string
}

const CardChannelUser: React.FC<CardChannelUser> = ({
    targetPseudo,
    targetId,
    targetName,
    targetPicture,
    targetRole,
    userRole,
	channel,
}) => {
    return (
        <div className="h-full w-full">
            <Card
                className={`flex items-center px-[6px] sm:px-[16px] md:px-[26px] h-[68px] bg-transparent w-full rounded-none shadow-none border-none justify-between`}
            >
                <div className="flex items-center h-full w-full gap-[10px] md:gap-[20px]">
                    <Avatar className="w-[48px] h-[48px] aspect-square">
                        <AvatarImage
                            className={`rounded-full object-cover w-[40px] h-[40px] border-[3px] ${getAvatarBorderColor(targetRole)}`}
                            src={targetPicture}
                        />
                        <AvatarFallback>{PinguAvatar}</AvatarFallback>
                    </Avatar>
                    <CardHeader className="w-full h-full flex justify-center p-0">
                        <CardTitle>{targetPseudo}</CardTitle>
                        <CardDescription className={getTextColor(targetRole)}>
                            {targetRole}
                        </CardDescription>
                    </CardHeader>
                </div>
                <div>
                    <DropdownChannelUser
                        targetId={targetId}
                        targetName={targetName}
                        role={userRole}
                        targetRole={targetRole}
						channel={channel}
                    />
                </div>
            </Card>
        </div>
    )
}

export default CardChannelUser
