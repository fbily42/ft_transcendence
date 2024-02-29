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
import { useQuery } from '@tanstack/react-query'
import { getUserMe } from '@/lib/Dashboard/dashboard.requests'
import { UserData } from '@/lib/Dashboard/dashboard.types'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Sailboat } from 'lucide-react'

interface UserCards {
    id: string
    userPicture: string
    userName: string
    userStatus: string
    bgColor: string
}

const UserCards: React.FC<UserCards> = ({
    id,
    userName,
    userPicture,
    userStatus,
    bgColor,
}) => {
    const navigate = useNavigate()

    const { data: currentUser } = useQuery<UserData>({
        queryKey: ['me'],
        queryFn: getUserMe,
    })

    return (
        <div className="h-full w-full">
            <Card
                className={`flex items-center px-[6px] sm:px-[16px] md:px-[26px] h-[68px] bg-${bgColor} w-full rounded-none shadow-none border-none justify-between`}
            >
                <div className="flex items-center h-full w-full gap-[10px] md:gap-[10px]">
                    <Avatar className="w-[48px] h-[48px] aspect-square  rounded-full">
                        <AvatarImage
                            className="rounded-full object-cover w-[48px] h-[48px] border-[3px] border-customDarkBlue"
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
                {currentUser?.pseudo !== userName && (
                    <Button
                        onClick={() => {
                            navigate(`/profile/${id}`)
                        }}
                        variant={'ghost'}
                        size={'smIcon'}
                    >
                        <Sailboat size={'16px'} />
                    </Button>
                )}
            </Card>
        </div>
    )
}

export default UserCards
