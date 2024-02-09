// import AvatarBg from '../../../assets/avatar-assets/background.svg'

type UserAvatarProps = {
    selectedAvatar?: string | undefined
}

const UserAvatar: React.FC<UserAvatarProps> = ({ selectedAvatar }) => {
    console.log(selectedAvatar)
    return (
        <div className="flex items-center justify-center h-full md:h-fit lg:h-full">
            <div className={`relative w-full h-full`}>
                {/* {selectedAvatar ? (
                    <img
                        src={selectedAvatar}
                        alt="Avatar Background"
                        className={`p-2 md:p-4 w-full h-full`}
                    />
                ) : (
                    <img
                        src={AvatarBg}
                        alt="Avatar Background"
                        className={`p-2 md:p-4 w-full h-full`}
                    />
                )} */}
                <img
                        src={selectedAvatar}
                        alt="Avatar Background"
                        className={`p-2 md:p-4 w-full h-full`}
                    />
            </div>
        </div>
    )
}

export default UserAvatar
