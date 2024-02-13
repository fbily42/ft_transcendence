import UserCards from '@/components/User/userCards/UserCards'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import { getChannelUsers } from '@/lib/Chat/chat.requests'
import { UserInChannel } from '@/lib/Chat/chat.types'
import { getUserStatus } from '@/lib/Chat/chat.utils'
import { useQuery } from '@tanstack/react-query'

interface UserListProps {
    channel: string
}

function getRole(user: UserInChannel): string {
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

	const socket = useWebSocket() as WebSocketContextType

    return (
        <div className="justify-between overflow-auto-y">
            {users?.map((user, index) =>
                !user.banned && !user.invited ? (
                    <div className={getUserStatus(socket, user.name) ? '' : 'opacity-50'}>
                        <UserCards
                            key={index}
                            bgColor="transparent"
                            userName={user.name}
                            userPicture={user.photo42}
                            userStatus={getRole(user)}
                            variant="CHAT"
                        ></UserCards>
                    </div>
                ) : null
            )}
        </div>
    )
}

export default UserList
