type UserAvatarProps = {
    selectedAvatar?: string
}

const UserAvatar: React.FC<UserAvatarProps> = ({ selectedAvatar }) => {
    return (
        <div className="flex items-center justify-center h-full md:h-fit lg:h-full">
            <div className={`relative w-full h-full`}>
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
