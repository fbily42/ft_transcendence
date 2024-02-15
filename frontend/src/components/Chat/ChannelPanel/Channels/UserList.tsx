import UserCards from '@/components/User/userCards/UserCards'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import { getChannelUsers } from '@/lib/Chat/chat.requests'
import { UserInChannel } from '@/lib/Chat/chat.types'
import { getMyrole, getRole, getUserStatus } from '@/lib/Chat/chat.utils'
import { useQuery } from '@tanstack/react-query'
import DropdownChannelUser from '../DropdownChannelUser'
import { UserData } from '@/lib/Dashboard/dashboard.types'
import { getUserMe } from '@/lib/Dashboard/dashboard.requests'

interface UserListProps {
    channel: string
}

const UserList: React.FC<UserListProps> = ({ channel }) => {
    const { data: users } = useQuery<UserInChannel[]>({
        queryKey: ['channelUsers', channel],
        queryFn: () => getChannelUsers(channel),
    })

	const { data: me} = useQuery<UserData>({
		queryKey: ['me'],
		queryFn: getUserMe
	})

	const socket = useWebSocket() as WebSocketContextType

    return (
        <div className="justify-between overflow-auto-y">
            {users?.map((user, index) =>
                !user.banned && !user.invited ? (
                    <div key={index} className={getUserStatus(socket, user.name) ? '' : 'opacity-50'}>
                        <UserCards
							id={user.userId.toString()}
                            bgColor="transparent"
                            userName={user.name}
                            userPicture={user.photo42}
                            userStatus={getRole(user)}
                            variant="CHAT"
                        ></UserCards>
						<DropdownChannelUser targetId={user.userId.toString()} targetName={user.name} role={getMyrole(me?.name!, users)} targetRole={getRole(user)}></DropdownChannelUser>
                    </div>
                ) : null
            )}
        </div>
    )
}

export default UserList
