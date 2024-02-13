import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Label } from '@radix-ui/react-label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import AvatarImg from '../User/userAvatar/AvatarImg'
import { Photo42, Pingu } from '@/assets/avatarAssociation'
import { useQuery } from '@tanstack/react-query'
import { UserData } from '@/lib/Dashboard/dashboard.types'
import { getUserMe } from '@/lib/Dashboard/dashboard.requests'
import { Check, Pencil, Plus } from 'lucide-react'

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
    const [openAvatars, setOpenAvatars] = useState<boolean>(false)
    const initialAvatar: ImageObject = Photo42()
    const [selectedAvatar, setSelectedAvatar] = useState<string>(
        initialAvatar.imageProfile
    )
    const [uploadedImage, setUploadedImage] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        setSelectedAvatar(initialAvatar.imageProfile)
    }, [initialAvatar.imageProfile])

    async function onSubmit(data: ProfileFormValues) {
        setErrorMessage('data pseudo = ' + data.pseudo)
    }

    const onAvatarButtonClick = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        setOpenAvatars(!openAvatars)
    }

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const file = e.target.files?.[0]
        console.log('event target ', e)

        if (file && file.type == 'image/svg+xml') {
            const url = URL.createObjectURL(file)
            // You can perform additional checks or validations here if needed
            console.log(file)
            console.log(url)
            // Update state with the selected image file
            setUploadedImage(file)
            setSelectedAvatar(url)
        }
    }

    console.log('selected avatar ', selectedAvatar)
    console.log('uploaded img ', uploadedImage)
    return (
        <div className="flex flex-col  justify-center text-center space-y-5">
            <div className="flex flex-col  justify-center text-center">
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
            <div className="w-full h-full flex flex-col justify-center items-center">
                <form
                    className="flex flex-col justify-center items-center space-y-4"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="flex flex-col justify-center items-center space-y-3">
                        <Label htmlFor="avatar" hidden>
                            Avatar
                        </Label>
                        <div
                            className="relative bg-background w-[150px] h-[150px] border-[3px] border-customYellow rounded-full"
                            style={{
                                backgroundImage: `url(${selectedAvatar})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div className="absolute bottom-[3px] right-[3px]">
                                <Button
                                    className="bg-customYellow rounded-full w-[30px] h-[30px] text-lg hover:bg-customDarkBlue"
                                    onClick={onAvatarButtonClick}
                                >
                                    <div className="text-white">
                                        {openAvatars ? (
                                            <Check className="h-[15px] w-[15px]" />
                                        ) : (
                                            <Pencil className="h-[15px] w-[15px]" />
                                        )}
                                    </div>
                                </Button>
                            </div>
                        </div>
                        <div className={openAvatars ? 'flex' : 'flex hidden'}>
                            <div>
                                <AvatarImg
                                    onSelect={(selectedImage) =>
                                        setSelectedAvatar(selectedImage)
                                    }
                                />
                            </div>
                            <div>
                                <Input
                                    type="file"
                                    accept="image/svg+xml"
                                    onChange={handleImageChange}
                                    hidden
                                    ref={fileInputRef}
                                    className="hidden"
                                />
                                <Button
                                    className="rounded-full bg-customYellow w-[70px] h-[70px]"
                                    onClick={(
                                        e: React.MouseEvent<HTMLElement>
                                    ) => {
                                        e.preventDefault()
                                        if (fileInputRef.current)
                                            fileInputRef.current.click()
                                    }}
                                >
                                    <div className="text-white ">
                                        <Plus className="h-[40px] w-[40px]" />
                                    </div>
                                </Button>
                            </div>
                        </div>
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
                        <div className="text-red-600 text-sm">
                            {errorMessage}
                        </div>
                    </div>
                    <div>
                        <Button
                            type="submit"
                            className="bg-customYellow text-lg font-semi-bold"
                        >
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
