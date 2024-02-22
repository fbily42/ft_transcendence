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
import { useNavigate } from 'react-router-dom'
import SetProfileForm from '@/components/Auth/SetProfileForm'
import { useQuery } from '@tanstack/react-query'
import { getUserMe } from '@/lib/Dashboard/dashboard.requests'

export default function UserActionsBtns() {
    // const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 900)
    const [openSetUp2FA, setOpenSetUp2FA] = useState<boolean>(false)
    const {
        data: currentUser,
        isError,
        isLoading,
    } = useQuery({
        queryKey: ['me'],
        queryFn: getUserMe,
    })
    if (isError) {
        return <div>Error</div>
    }
    if (isLoading) {
        return <div>Loading...</div>
    }

    const initialAvatar = currentUser?.avatar
    const initialPseudo = currentUser?.pseudo

    // const handleResize = () => {
    //     setIsMobile(window.innerWidth < 900)
    // }

    // useEffect(() => {
    //     handleResize()
    //     window.addEventListener('resize', handleResize)

    //     // Cleanup the event listener on component unmount
    //     return () => {
    //         window.removeEventListener('resize', handleResize)
    //     }
    // }, [])
    const navigate = useNavigate()

    return (
        <div
            id="Buttons"
            className={`w-full flex gap-[12px] md:gap-[8px] lg:gap-[26px] no-scrollbar`}
        >
            <Dialog>
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
                        onClose={() => navigate('/profile/me')}
                    />
                </DialogContent>
            </Dialog>
            <Button
                variant={'outlineBlue'}
                className="w-full"
                onClick={() => setOpenSetUp2FA(true)}
            >
                Setup 2FA
            </Button>
            <div>
                <SetUp2FAModal
                    open={openSetUp2FA}
                    onClose={() => {
                        setOpenSetUp2FA(false)
                    }}
                />
            </div>
        </div>
    )
}
