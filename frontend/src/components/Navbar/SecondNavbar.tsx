import { useContext, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Music2, RocketIcon } from 'lucide-react'
import { TwoFAContext } from '@/context/twoFAEnableContext'
import axios from 'axios'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getUsers } from '@/lib/Dashboard/dashboard.requests'
import { UserData } from '@/lib/Dashboard/dashboard.types'
import {
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
    CommandSeparator,
} from 'cmdk'
import {
    EnvelopeClosedIcon,
    FaceIcon,
    GearIcon,
    PersonIcon,
} from '@radix-ui/react-icons'
import { CommandShortcut } from '../ui/command'
import UserCards from '../User/userCards/UserCards'
import SearchbarCards from '../User/userCards/SearchbarCards'

export default function SecondNavbar(): JSX.Element {
    const navigate = useNavigate()
    const { twoFAenabled, enableTwoFA, disableTwoFA, twoFAverified } =
        useContext(TwoFAContext)
    const [searchTerm, setSearchTerm] = useState('')
    const [isFocused, setIsFocused] = useState(false)

    const { data: users } = useQuery<UserData[]>({
        queryKey: ['users'],
        queryFn: getUsers,
    })

    const filteredUsers = users?.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value)
    }

    const onCheckedChange = async () => {
        if (twoFAenabled) {
            //add call to otp disable
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/auth/otp/disable`,
                    {},
                    { withCredentials: true }
                )
                disableTwoFA()
                toast.success(response.data.message)
            } catch (error) {
                toast.error('Internal server error')
            }
        } else {
            if (twoFAverified) {
                try {
                    //add call to otp enable
                    const response = await axios.post(
                        `${import.meta.env.VITE_BACKEND_URL}/auth/otp/enable`,
                        {},
                        { withCredentials: true }
                    )
                    enableTwoFA()
                    toast.success(response.data.message)
                } catch (error) {
                    toast.error('Internal server error')
                }
            } else {
                toast('Impossible to enable 2FA. Please set up 2FA.', {
                    action: {
                        label: 'Profile settings',
                        onClick: () => navigate('/profile/me'),
                    },
                })
                // toast.error("Impossible to enable 2FA. Please set up 2FA.")
            }
        }
    }

    return (
        <div className="flex justify-between align-center pl-[122px] pr-[36px] gap-[50px] h-[10vh]">
            <div className="flex flex-col w-auto justify-center items-start relative">
                <div id="searchbar" className="flex flex-col">
                    <Input
                        className="focus-visible:ring-1 focus-visible:ring-customDarkBlue bg-white shadow-boxShadow hover:border-[#45A0E3] hover:border-2 focus:border-[#45A0E3] focus:border-2 active:border-[#45A0E3] active:border-2"
                        type="text"
                        placeholder="Search Player"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                </div>
                {isFocused && (
                    <div
                        className="z-50 p-[20px] flex flex-col w-fit h-fit absolute top-full left-0 bg-white overflow-auto rounded-[36px] border-input shadow-lg gap-[10px]"
                        id="searchbar on focus"
                    >
                        {filteredUsers?.map((user) => (
                            // <div key={user.id}>{user.name}</div>
                            <SearchbarCards
                            id={user.id.toString()}
                            key={user.id}
                            bgColor="white"
                            userName={user.name}
                            userPicture={user.avatar}
                            userStatus={''}
                            variant="OTHER"
                        />
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-between gap-[50px]">
                <div className="flex items-center space-x-2">
                    <Switch
                        id="double-auth"
                        checked={twoFAenabled}
                        onCheckedChange={onCheckedChange}
                        // disabled={!twoFAverified}
                    />
                    <Label htmlFor="double-auth">
                        Two Factor Authentication
                    </Label>
                </div>

                <div className="flex items-center gap-[10px]">
                    <Button
                        variant="secondNavIconStyle"
                        size="secondNavIconSize"
                    >
                        <div className="text-black">
                            <Music2 className="h-[24px] w-[24px]" />
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    )
}
