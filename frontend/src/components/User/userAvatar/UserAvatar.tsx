type UserAvatarProps = {
    selectedAvatar?: string
}

const UserAvatar: React.FC<UserAvatarProps> = ({ selectedAvatar }) => {
    return (
        <div className="flex items-center justify-center h-full lg:h-full">
            <img
                src={selectedAvatar}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover"
            />
        </div>
    )
}

export default UserAvatar
