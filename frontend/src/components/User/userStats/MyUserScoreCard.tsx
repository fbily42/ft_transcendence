import { getUserMe } from '@/lib/Dashboard/dashboard.requests'
import { UserData } from '@/lib/Dashboard/dashboard.types'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import NoAchievements from '@/assets/badges/No achivement.png'
import { Avatar } from '@/components/ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'

export default function MyUserScoreCard() {
    const { data: me } = useQuery<UserData>({
        queryKey: ['me'],
        queryFn: getUserMe,
    })

    const [open, setOpen] = useState<boolean>(false)

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
                            <p className="text-[12px]">{me?.score}</p>
                        </div>
                    </div>
                </div>
                <div
                    className="flex items-center justify-center w-[70px] h-[70px] border-[#C1E2F7] rounded-full"
                    onClick={() => setOpen(true)}
                >
                    <Avatar className="aspect-square w-[100px] h-fit flex items-center justify-center">
                        <AvatarImage
                            className="rounded-full object-cover"
                            src={NoAchievements}
                        ></AvatarImage>
                    </Avatar>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Achievements</DialogTitle>
                            <DialogDescription>
                                Choose the badge you want to display on your
                                profile.
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
