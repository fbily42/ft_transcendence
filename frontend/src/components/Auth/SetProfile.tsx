import { Photo42 } from '@/assets/avatarAssociation'
import SetProfileForm from './SetProfileForm'
import { useNavigate } from 'react-router'

type SetProfileprops = {
    children: React.ReactNode
}

const SetProfile: React.FC<SetProfileprops> = ({ children }) => {
    const navigate = useNavigate()

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
                <SetProfileForm
                    submitButtonText="I'm ready to noot"
                    currentAvatar={Photo42()}
                    currentPseudo=""
                    onClose={() => navigate('/')}
                />
                {children}
            </div>
        </div>
    )
}

export default SetProfile
