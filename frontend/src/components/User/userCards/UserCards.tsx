import React from 'react'
import {
    Card,
    CardHeader,
    // CardContent,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import PinguAvatar from '../../../assets/empty-state/pingu-face.svg'
import DropdownCard from './DropdownCard'

interface UserCards {
    id: string
    userPicture: string
    userName: string
    userStatus: string //change in boolean
    bgColor: string
    variant: 'USER_PROFILE' | 'CHAT'
}

const UserCards: React.FC<UserCards> = ({
    id,
    userName,
    userPicture,
    userStatus,
    variant,
    bgColor,
}) => {
    return (
        <div className="h-full w-full">
            <Card
                className={`flex items-center px-[6px] sm:px-[16px] md:px-[26px] h-[68px] bg-${bgColor} w-full rounded-none shadow-none border-none justify-between`}
            >
                <div className="flex items-center h-full w-full gap-[10px] md:gap-[20px]">
                    <Avatar className="w-[48px] h-[48px]">
                        <AvatarImage
                            className="rounded-full object-cover w-[40px] h-[40px]"
                            src={userPicture} //change whith userPicture when merged
                        />
                        <AvatarFallback>{PinguAvatar}</AvatarFallback>
                    </Avatar>
                    <CardHeader className="w-full h-full flex justify-center p-0">
                        <CardTitle>{userName}</CardTitle>
                        <CardDescription>{userStatus}</CardDescription>
                    </CardHeader>
                </div>
                <div>
                    <DropdownCard variant={variant} id={id} />
                </div>
            </Card>
        </div>
    )
}

export default UserCards
