import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import PinguAvatar from '@/assets/empty-state/pingu-face.svg'

type UserAvatarProps = {
    selectedAvatar?: string
}

const UserAvatar: React.FC<UserAvatarProps> = ({ selectedAvatar }) => {
    return (
        <div className="flex items-center justify-center h-full lg:h-full w-full bg-red-400">
            <Avatar className="w-full h-full rounded-full object-cover bg-red-300">
                <AvatarImage
                    className="w-full h-full rounded-full object-cover"
                    src={selectedAvatar}
                />
                <AvatarFallback>
                    <img
                        className="w-full h-full rounded-full object-cover"
                        src={PinguAvatar}
                        alt="pingu"
                    />
                </AvatarFallback>
            </Avatar>
        </div>
    )
}

export default UserAvatar
