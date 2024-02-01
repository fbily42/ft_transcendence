import AvatarBg from '../../../assets/avatar-assets/background.svg'

export default function UserAvatar() {
    return (
        <div className="flex items-center justify-center h-full md:h-fit lg:h-full">
            <div className={`relative w-full h-full`}>
                <img src={AvatarBg} alt="Avatar Background" className={`p-2 md:p-4 w-full h-full`}/>
            </div>
        </div>
    )
}
