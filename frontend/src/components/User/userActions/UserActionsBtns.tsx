import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Photo42 } from '@/assets/avatarAssociation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import UserAvatar from '../userAvatar/UserAvatar'
import SetUp2FAModal from '@/components/Profile/SetUp2FAModal'
import AvatarImg from '../userAvatar/AvatarImg'

export default function UserActionsBtns() {
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 900)
    const [openSetUp2FA, setOpenSetUp2FA] = useState<boolean>(false)

    const [selectedAvatar, setSelectedAvatar] = useState<string>(
        Photo42().imageBackground || ''
    )
   function handleChangeImage() {
    return ''
   }

    console.log(selectedAvatar, 'Ici', Photo42)

    const handleResize = () => {
        setIsMobile(window.innerWidth < 900)
    }

    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize)

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <div
            id="Buttons"
            className={`w-full flex gap-[12px] md:gap-[8px] lg:gap-[26px]`}
        >
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="w-full" variant={'default'}>
                        Change Avatar
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] flex flex-col items-center">
                    <DialogHeader className="flex items-center">
                        <DialogTitle>Edit my Noot</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center flex-col gap-4 py-4">
                        <div className="w-[80%]">
                            <UserAvatar selectedAvatar={selectedAvatar} />
                        </div>
                        <div className="flex flex-col w-full max-w-sm items-start gap-2">
                            <Label htmlFor="username" className="text-right">
                                Username
                            </Label>
                            <Input
                                id="username"
                                defaultValue="42login"
                                placeholder="42login"
                                className="col-span-3"
                            />
                            <AvatarImg
                                onSelect={(selectedImage) =>
                                    setSelectedAvatar(selectedImage)
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => handleChangeImage()} type="submit">
                            Save changes
                        </Button>
                    </DialogFooter>
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