import {
    FirstChannel,
    FirstFriend,
    FirstGame,
    FirstWin,
} from '@/assets/badgesAssociation'
import { getUserById } from '@/lib/Dashboard/dashboard.requests'
import { AchievementType, Badge } from '@/lib/Profile/profile.types'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import NoAchievements from '@/assets/badges/No achivement.png'
import { UserData } from '@/lib/Dashboard/dashboard.types'

export default function UserScoreCard(): JSX.Element {
    const param = useParams<string>()
    const badges = new Map<AchievementType, Badge>([
        ['FIRST_FRIEND', FirstFriend],
        ['FIRST_CHANNEL', FirstChannel],
        ['FIRST_GAME', FirstGame],
        ['FIRST_WIN', FirstWin],
    ])

    const { data: friend } = useQuery<UserData>({
        queryKey: ['users', param.id],
        queryFn: () => getUserById(param.id!),
    })
    return (
        <div
            id="Pseudo"
            className="w-full p-[16px] md:p-[16px] lg:p-[26px] border-2 border-[#C1E2F7] rounded-[30px]"
        >
            <div className="w-full flex justify-between">
                <div className="flex items-center">
                    <div className="">
                        <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl font-semibold">
                            {friend?.pseudo}
                        </h1>
                        <div>
                            <p className="text-[12px]">
                                {friend?.score}
                                <span className="opacity-70"> points</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center w-[70px] h-[70px] border-[#C1E2F7] rounded-full">
                    <Avatar className="aspect-square w-[100px] h-[100px] flex items-center justify-center">
                        <AvatarImage
                            className="rounded-full object-cover"
                            src={
                                friend?.chosenBadge
                                    ? badges.get(friend.chosenBadge)?.src
                                    : NoAchievements
                            }
                        ></AvatarImage>
                    </Avatar>
                </div>
            </div>
        </div>
    )
}
