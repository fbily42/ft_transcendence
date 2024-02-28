import React from 'react'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import PinguAvatar from '../../../assets/empty-state/pingu-face.svg'
import { useQuery } from '@tanstack/react-query'
import { getUserMe } from '@/lib/Dashboard/dashboard.requests'
import { UserData } from '@/lib/Dashboard/dashboard.types'

interface UserCards {
    id: string
    userPicture: string
    userName: string
    userStatus: string
    bgColor: string
    variant: 'FRIEND' | 'OTHER'
}

const SearchbarCards: React.FC<UserCards> = ({
    userName,
    userPicture,
    userStatus,
    bgColor,
}) => {
    const { data: currentUser } = useQuery<UserData>({
        queryKey: ['me'],
        queryFn: getUserMe,
    })

    return (
        <div className="h-full w-full">
            {currentUser?.pseudo !== userName && (
                <Card
                    className={`flex items-center px-[6px] sm:px-[16px] md:px-[26px] h-[68px] bg-${bgColor} w-full rounded-none shadow-none border-none justify-between`}
                >
                    <div className="flex items-center h-full w-full gap-[10px] md:gap-[20px]">
                        <Avatar className="w-[48px] h-[48px]">
                            <AvatarImage
                                className="rounded-full object-cover w-[40px] h-[40px]"
                                src={userPicture}
                            />
                            <AvatarFallback>
                                <img src={PinguAvatar} alt="pingu" />
                            </AvatarFallback>
                        </Avatar>
                        <CardHeader className="w-full h-full flex justify-center p-0">
                            <CardTitle>{userName}</CardTitle>
                            <CardDescription>{userStatus}</CardDescription>
                        </CardHeader>
                    </div>
                </Card>
            )}
        </div>
    )
}

export default SearchbarCards
