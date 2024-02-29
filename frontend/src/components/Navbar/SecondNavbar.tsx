import { useContext } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { TwoFAContext } from '@/context/twoFAEnableContext'
import axios from 'axios'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Searchbar } from './Searchbar'

export default function SecondNavbar(): JSX.Element {
    const navigate = useNavigate()
    const { twoFAenabled, enableTwoFA, disableTwoFA, twoFAverified } =
        useContext(TwoFAContext)

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
                <Searchbar></Searchbar>
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
            </div>
        </div>
    )
}
