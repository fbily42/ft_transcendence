import React from 'react'
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import PinguAvatar from '../../../assets/empty-state/pingu-face.svg'
import DropdownCard from './DropdownCard'

interface UserCards {
    userPicture: string
    userName: string
    userStatus: string //change in boolean
    variant: 'USER_PROFILE' | 'CHAT'
}

const UserCards: React.FC<UserCards> = ({
    userName,
    userPicture,
    userStatus,
    variant,
}) => {
    return (
        <div className="h-full w-full">
            <Card
                className="
				flex items-center
				px-[6px] sm:px-[16px] md:px-[26px]
				h-[68px] w-full
				bg-white
				rounded-none
				shadow-none
				border-none
				justify-between"
            >
                <div className="flex items-center h-full w-full gap-[10px] md:gap-[20px]">
                    <Avatar className="w-[48px] h-[48px]">
                        <AvatarImage
                            className="w-[48px] h-[48px] rounded-full"
                            src={PinguAvatar} //change whith userPicture when merged
                        />
                        <AvatarFallback>{PinguAvatar}</AvatarFallback>
                    </Avatar>
                    <CardHeader className="w-full h-full flex justify-center p-0">
                        <CardTitle>{userName}</CardTitle>
                        <CardDescription>{userStatus}</CardDescription>
                    </CardHeader>
                </div>
                {/* <div>
                    <CardHeader>
                        <CardTitle>{userName}</CardTitle>
                        <CardDescription>{userStatus}</CardDescription>
                    </CardHeader>
                </div> */}
                <div>
                    <DropdownCard variant={variant} />
                </div>
            </Card>
        </div>
    )
}

export default UserCards
