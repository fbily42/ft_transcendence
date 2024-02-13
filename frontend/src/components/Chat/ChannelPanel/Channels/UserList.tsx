import UserCards from '@/components/User/userCards/UserCards'
import { getChannelUsers } from '@/lib/Chat/chat.requests'
import { UserInChannel } from '@/lib/Chat/chat.types'
import { useQuery } from '@tanstack/react-query'

interface UserListProps {
    channel: string
}

function getStatus(user: UserInChannel): string {
    const statusKeys: (keyof UserInChannel)[] = [
        'owner',
        'admin',
        'member',
        'muted',
    ]
    for (let key of statusKeys) {
        if (user[key] === true) return key
    }
    return 'member'
}

const UserList: React.FC<UserListProps> = ({ channel }) => {
    const { data: users } = useQuery({
        queryKey: ['channelUsers', channel],
        queryFn: () => getChannelUsers(channel),
    })

    return (
        <div className="justify-between overflow-auto-y">
            {users?.map((user, index) =>
                !user.banned && !user.invited ? (
                    <UserCards
                        key={index}
                        bgColor="transparent"
                        userName={user.name}
                        userPicture={user.photo42}
                        userStatus={getStatus(user)}
                        variant="CHAT"
                    ></UserCards>
                ) : null
            )}
        </div>
    )
}

export default UserList
