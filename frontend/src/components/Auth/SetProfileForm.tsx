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
import ImageInput from './ImageInput'
import axios from 'axios'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

type SetProfileFormprops = {
    children: React.ReactNode
}

// type ProfileFormValues = {
//     pseudo: string
// }

// type ImageObject = {
//     id: number
//     imageProfile: string
//     imageBackground: string | undefined
// }

const zodSchema = z.object({
    pseudo: z
        .string()
        .min(2, { message: 'Pseudo must be at least 2 characters long' })
        .max(20, { message: 'Pseudo can not exceed 20 characters' })
        .regex(/^[a-zA-Z]+$/, { message: 'Pseudo can only contain letters' }),
})

type ProfileFormValues = z.infer<typeof zodSchema>

const SetProfileForm: React.FC<SetProfileFormprops> = ({ children }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(zodSchema),
    })
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [openAvatars, setOpenAvatars] = useState<boolean>(false)
    const initialAvatar: string = Photo42()
    const [selectedAvatar, setSelectedAvatar] = useState<string>(initialAvatar)
    const [uploadedImage, setUploadedImage] = useState<File | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        setSelectedAvatar(initialAvatar)
    }, [initialAvatar])

    async function onSubmit(data: ProfileFormValues) {
        try {
            const formData = new FormData()

            if (uploadedImage) formData.append('file', uploadedImage)
            else {
                formData.append('avatar', selectedAvatar)
            }
            formData.append('pseudo', data.pseudo)

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/uploads`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                }
            )

            navigate('/')
        } catch (error) {
            setErrorMessage(error.response.data.message)
        }
    }

    const onAvatarButtonClick = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        setOpenAvatars(!openAvatars)
    }

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const file = e.target.files?.[0]

        if (file && file.type == 'image/svg+xml') {
            const url = URL.createObjectURL(file)

            setUploadedImage(file)
            setSelectedAvatar(url)
        }
    }

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
                                    onSelect={(selectedImage) => {
                                        setSelectedAvatar(selectedImage)
                                        setUploadedImage(null)
                                    }}
                                />
                            </div>
                            <div>
                                <ImageInput
                                    onChange={handleImageChange}
                                    size={70}
                                />
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
                        <div className="text-red-600 text-sm">
                            {errors.pseudo && <p>{errors.pseudo.message}</p>}
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
