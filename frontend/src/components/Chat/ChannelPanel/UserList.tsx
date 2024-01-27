import UserCards from '@/components/User/userCards/UserCards'
import { getChannelUsers } from '@/lib/Chat/chat.requests'
import { useQuery } from '@tanstack/react-query'

interface UserListProps {
    channel: string
}

function UserList(channel: UserListProps) {
    const { data: users } = useQuery({
        queryKey: ['channelUsers', channel.channel],
        queryFn: () => getChannelUsers(channel.channel),
    })

    return (
        <div className="justify-between overflow-auto-y">
            {users?.map((user, index) => (
                <UserCards
                    key={index}
                    bgColor="transparent"
                    userName={user.name}
                    userPicture={user.photo42}
                    userStatus="member"
                    variant="CHAT"
                ></UserCards>
            ))}
        </div>
    )
}

export default UserList
