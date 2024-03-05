import { Button } from '@/components/ui/button'
import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import SetUp2FAModal from '@/components/Profile/SetUp2FAModal'
import SetProfileForm from '@/components/Auth/SetProfileForm'
import { useQuery } from '@tanstack/react-query'
import { getUserMe } from '@/lib/Dashboard/dashboard.requests'
import { UserData } from '@/lib/Dashboard/dashboard.types'

export default function UserActionsBtns() {
    const [openSetUp2FA, setOpenSetUp2FA] = useState<boolean>(false)
    const [openProfileSettings, setOpenProfileSettings] =
        useState<boolean>(false)

    const { data: currentUser } = useQuery<UserData>({
        queryKey: ['me'],
        queryFn: getUserMe,
    })

    const initialAvatar: string | undefined = currentUser?.avatar
    const initialPseudo: string | undefined = currentUser?.pseudo

    return (
        <div
            id="Buttons"
            className={`w-full flex gap-[12px] md:gap-[8px] lg:gap-[26px] no-scrollbar`}
        >
            <Dialog
                open={openProfileSettings}
                onOpenChange={setOpenProfileSettings}
            >
                <DialogTrigger asChild>
                    <Button className="w-full" variant={'default'}>
                        Settings
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] flex flex-col items-center">
                    <DialogHeader className="flex items-center">
                        <DialogTitle>Edit my Noot</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here.
                        </DialogDescription>
                    </DialogHeader>
                    <SetProfileForm
                        submitButtonText="I'm ready to noot"
                        currentAvatar={initialAvatar || ''}
                        currentPseudo={initialPseudo || ''}
                        onClose={() => setOpenProfileSettings(false)}
                    />
                </DialogContent>
            </Dialog>
            <Dialog open={openSetUp2FA} onOpenChange={setOpenSetUp2FA}>
                <DialogTrigger asChild>
                    <Button
                        className="w-full bg-customBlue hover:bg-customBlue/80 text-customDarkBlue"
                        onClick={() => setOpenSetUp2FA(true)}
                    >
                        Setup 2FA
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] flex flex-col items-center">
                    <SetUp2FAModal
                        open={openSetUp2FA}
                        onClose={() => {
                            setOpenSetUp2FA(false)
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
