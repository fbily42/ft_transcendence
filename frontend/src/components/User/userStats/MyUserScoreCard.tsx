import {
    getUserMe,
    updateChosenBadge,
} from '@/lib/Dashboard/dashboard.requests'
import { UserData } from '@/lib/Dashboard/dashboard.types'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import NoAchievements from '@/assets/badges/No achivement.png'
import {
    FirstChannel,
    FirstFriend,
    FirstGame,
    FirstWin,
} from '@/assets/badgesAssociation'
import { AchievementType, Badge, BadgeDTO } from '@/lib/Profile/profile.types'
import PingaModal from '@/assets/other/Pinga-over-modal.svg'

export default function MyUserScoreCard(): JSX.Element {
    const [open, setOpen] = useState<boolean>(false)
    const badges = new Map<AchievementType, Badge>([
        ['FIRST_FRIEND', FirstFriend],
        ['FIRST_CHANNEL', FirstChannel],
        ['FIRST_GAME', FirstGame],
        ['FIRST_WIN', FirstWin],
    ])
    const queryClient = useQueryClient()

    const { data: me } = useQuery<UserData>({
        queryKey: ['me'],
        queryFn: getUserMe,
    })

    const mutation = useMutation({
        mutationFn: (data: BadgeDTO) => updateChosenBadge(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['me'],
            })
        },
    })

    const badgeClick = (chosenBadge: AchievementType) => {
        const badgeDto: BadgeDTO = { chosenBadge: chosenBadge }
        mutation.mutate(badgeDto)
    }

    return (
        <div
            id="Pseudo"
            className="w-full p-[16px] md:p-[16px] lg:p-[26px] border-2 border-[#C1E2F7] rounded-[30px]"
        >
            <div className="w-full flex justify-between">
                <div className="flex items-center">
                    <div className="">
                        <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl font-semibold">
                            {me?.pseudo}
                        </h1>
                        <div>
                            <p className="text-[12px]">
                                {me?.score}
                                <span className="opacity-70"> points</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div
                    className="cursor-pointer hover:opacity-80 flex items-center justify-center w-[70px] h-[70px] border-[#C1E2F7] rounded-full"
                    onClick={() => setOpen(true)}
                >
                    <Avatar className="aspect-square w-[100px] h-[100px] flex items-center justify-center">
                        <AvatarImage
                            className="rounded-full object-cover"
                            src={
                                me?.chosenBadge
                                    ? badges.get(me.chosenBadge)?.src
                                    : NoAchievements
                            }
                        ></AvatarImage>
                    </Avatar>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogHeader className='relative'>
                            <img className='absolute right-0 top-[-80px]' src={PingaModal} alt="" />
                            <DialogTitle>Achievements</DialogTitle>
                            <DialogDescription>
                                Select the badge you want to display on your
                                profile.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-evenly">
                            {Array.from(badges).map(([badgeString, badge]) => {
                                let hasBadge: boolean = false
                                if (me?.allBadges.includes(badge.string)) {
                                    hasBadge = true
                                }
                                return (
                                    <div
                                        key={badgeString}
                                        className="cursor-pointer flex items-center justify-center w-[70px] h-[70px] border-[#C1E2F7] rounded-full"
                                    >
                                        <Avatar
                                            onClick={() => {
                                                if (hasBadge)
                                                    badgeClick(badge.string)
                                            }}
                                            className="aspect-square w-[100px] h-fit flex items-center justify-center"
                                        >
                                            <AvatarImage
                                                className="rounded-full object-cover"
                                                src={
                                                    hasBadge
                                                        ? badge.src
                                                        : badge.emptyState
                                                }
                                            ></AvatarImage>
                                        </Avatar>
                                    </div>
                                )
                            })}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
