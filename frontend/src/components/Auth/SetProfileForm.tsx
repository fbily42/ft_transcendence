import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Label } from '@radix-ui/react-label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import AvatarImg from '../User/userAvatar/AvatarImg'
import { Photo42, Pingu } from '@/assets/avatarAssociation'
import { useQuery } from '@tanstack/react-query'
import { UserData } from '@/lib/Dashboard/dashboard.types'
import { getUserMe } from '@/lib/Dashboard/dashboard.requests'

type SetProfileFormprops = {
    children: React.ReactNode
}

type ProfileFormValues = {
    pseudo: string
}

type ImageObject = {
    id: number
    imageProfile: string
    imageBackground: string | undefined
}

const SetProfileForm: React.FC<SetProfileFormprops> = ({ children }) => {
    const { register, handleSubmit } = useForm<ProfileFormValues>()
    const [errorMessage, setErrorMessage] = useState<string>('')
    const initialAvatar: ImageObject = Photo42()
    const [selectedAvatar, setSelectedAvatar] =
        useState<ImageObject>(initialAvatar)

    useEffect(() => {
        setSelectedAvatar(initialAvatar)
    }, [initialAvatar.imageProfile])

    async function onSubmit(data: ProfileFormValues) {
        setErrorMessage('data pseudo = ' + data.pseudo)
    }
    // console.log('query data = ', data)
    // console.log('avatar src = ', selectedAvatar)
    return (
        <div>
            <div className="flex flex-col gap-y-[10px] justify-center text-center">
                <div>
                    <p className="text-5xl font-bold">
                        WELCOME TO PINGUCENDENCE
                    </p>
                </div>
                <div>
                    <p className="text-2xl">
                        Choose an avatar and a noot username
                    </p>
                </div>
            </div>
            <div className="w-full h-full flex flex-col justify-center items-center bg-pink-400">
                <form
                    className="flex flex-col justify-center items-center space-y-3"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div>
                        <Label htmlFor="avatar" hidden>
                            Avatar
                        </Label>
                        <div
                            className="relative bg-[#C1E2F7] w-[80px] h-[80px] border-[3px] border-customYellow rounded-full"
                            style={{
                                backgroundImage: `url(${selectedAvatar.imageProfile})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div className="absolute -bottom-1 -right-1">
                                <Button className="bg-customYellow rounded-full w-[30px] h-[30px]">
                                    +
                                </Button>
                            </div>
                        </div>
                        {/* <AvatarImg
                            onSelect={(selectedImage) =>
                                setSelectedAvatar(selectedImage)
                            }
                        /> */}
                    </div>
                    <div>
                        <Label htmlFor="pseudo" hidden>
                            Name
                        </Label>
                        <Input
                            id="pseudo"
                            placeholder="Noot's name"
                            {...register('pseudo')}
                        />
                    </div>
                    <div className="text-red-600 text-sm">{errorMessage}</div>
                    <div>
                        <Button className="bg-customYellow text-lg font-semi-bold">
                            I'm ready to noot!
                        </Button>
                    </div>
                </form>
                {children}
            </div>
        </div>
    )
}

export default SetProfileForm
