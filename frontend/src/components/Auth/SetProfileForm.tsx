import { ChangeEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Label } from '@radix-ui/react-label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import AvatarImg from '../User/userAvatar/AvatarImg'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, Pencil } from 'lucide-react'
import ImageInput from './ImageInput'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { SetProfileFormprops, ProfileFormProps } from '@/lib/Auth/auth.types'
import { setProfileFn } from '@/lib/Auth/auth.request'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'

const zodSchema = z.object({
    pseudo: z
        .string()
        .min(2, { message: 'Pseudo must be at least 2 characters long' })
        .max(10, { message: 'Pseudo can not exceed 10 characters' })
        .regex(/^[a-zA-Z]+$/, { message: 'Pseudo can only contain letters' }),
})

type ProfileFormValues = z.infer<typeof zodSchema>

const SetProfileForm: React.FC<SetProfileFormprops> = ({
    submitButtonText,
    currentAvatar,
    currentPseudo,
    onClose,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(zodSchema),
        defaultValues: { pseudo: currentPseudo },
    })
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [openAvatars, setOpenAvatars] = useState<boolean>(false)
    const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatar)
    const [uploadedImage, setUploadedImage] = useState<File | null>(null)
    const queryClient = useQueryClient()
    const socket = useWebSocket() as WebSocketContextType
    const mutation = useMutation({
        mutationFn: (data: ProfileFormProps) =>
            setProfileFn(
                data.pseudo,
                data.avatar,
                data.file,
                data.setErrorMessage,
                data.onClose
            ),
        onSuccess: (_, data) => {
            queryClient.invalidateQueries({ queryKey: ['me'] })
            queryClient.invalidateQueries({ queryKey: ['users'] })
            socket?.webSocket?.emit('refreshSearchBar')
        },
    })

    useEffect(() => {
        setSelectedAvatar(currentAvatar)
    }, [currentAvatar])

    async function onSubmit(data: ProfileFormValues) {
        setErrorMessage('')
        mutation.mutate({
            pseudo: data.pseudo,
            avatar: selectedAvatar,
            file: uploadedImage,
            setErrorMessage,
            onClose,
        })
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
                            type="button"
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
                        >
                            <ImageInput
                                onChange={handleImageChange}
                                size={70}
                            />
                        </AvatarImg>
                    </div>
                </div>
            </div>
            <div>
                <Label htmlFor="pseudo" hidden>
                    Pseudo
                </Label>
                <Input
                    id="pseudo"
                    placeholder="Noot's name"
                    {...register('pseudo')}
                />
                <div className="text-red-600 text-sm">{errorMessage}</div>
                <div className="text-red-600 text-sm">
                    {errors.pseudo && <p>{errors.pseudo.message}</p>}
                </div>
            </div>
            <div>
                <Button
                    type="submit"
                    className="bg-customYellow text-lg font-semi-bold"
                >
                    {submitButtonText}
                </Button>
            </div>
        </form>
    )
}

export default SetProfileForm
