import AvatarBg from '../../../assets/avatar-assets/background.svg'

export default function UserAvatar({isMobile}) {
    return (
        <div className="flex items-center justify-center h-full md:h-fit lg:h-full">
            <div className={`relative ${isMobile ? 'w-full h-full' : 'w-full h-full'}`}>
                <img src={AvatarBg} alt="Avatar Background" className={`p-2 md:p-4 w-full h-full`}/>
            </div>
        </div>
    )
}
