import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Label } from '@radix-ui/react-label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

type SetProfileFormprops = {
    children: React.ReactNode
}

type ProfileFormValues = {
    name: string
}

const SetProfileForm: React.FC<SetProfileFormprops> = ({ children }) => {
    const { register, handleSubmit } = useForm<ProfileFormValues>()
    const [errorMessage, setErrorMessage] = useState<string>('')

    async function onSubmit(data: ProfileFormValues) {
        setErrorMessage('data name = ' + data.name)
    }

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
                    className="flex flex-col justify-center items-center space-y-1"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div>
                        <Label htmlFor="name" hidden>
                            Name
                        </Label>
                        <Input
                            id="name"
                            placeholder="Noot's name"
                            {...register('name')}
                        />
                    </div>
                    <div className="text-red-600 text-sm">{errorMessage}</div>
                    <Button className="bg-customYellow text-lg font-semi-bold">
                        I'm ready to noot!
                    </Button>
                </form>
                {children}
            </div>
        </div>
    )
}

export default SetProfileForm
