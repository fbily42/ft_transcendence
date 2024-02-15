import { FriendData, UserData } from '@/lib/Dashboard/dashboard.types'
import PinguAvatar from '../../assets/empty-state/pingu-face.svg'
import UserCards from '../User/userCards/UserCards'
import { Skeleton } from '../ui/skeleton'
import { getUsers } from '@/lib/Dashboard/dashboard.requests'
import { useQuery } from '@tanstack/react-query'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'

export default function FriendsList({ friends }: { friends: FriendData[] }) {
    const { data, isLoading, isError } = useQuery<UserData>({
        queryKey: ['users'],
        queryFn: () => getUsers(),
    })
    // const param = useParams()

    // const { data, isError, isLoading } = useQuery({
    //     queryKey: ['users', param.id],
    //     queryFn: () => getUserById(param.id!),
    // })
    // if (isError) {
    //     return <div>Error</div>
    // }
    // if (isLoading) {
    //     return <div>Loading...</div>
    // }

    const webSocket = useWebSocket() as WebSocketContextType

    // webSocket.usersOn.get('fbily')

    function getStatus(name: string) {
        const webSocketStatus = webSocket.usersOn.has(name)
        let friendStatus: string

        if (webSocketStatus === true) {
            friendStatus = 'Online'
        } else {
            friendStatus = 'Offline'
        }
        return friendStatus
    }

    if (isError) {
        return <div>Error</div>
    }
    if (isLoading) {
        return <div>Loading...</div>
    }

    console.log(friends, 'friends')

    return (
        <div>
            <div className="bg-white w-full flex flex-col rounded-[26px] md:rounded-[30px] lg:rounded-[36px] ">
                {/* {users && users.length > 0 ? (
                    users.map((user) => (
                        <UserCards
                            id={user.id.toString()}
                            key={user.id}
                            bgColor="white"
                            userName={user.name}
                            userPicture={user.photo42 || PinguAvatar}
                            userStatus={getStatus(user.name)}
                            variant="USER_PROFILE"
                        />
                    )) */}
                {friends && friends.length > 0 ? (
                    friends.map((friend: FriendData) => (
                        <UserCards
                            id={friend.id.toString()}
                            key={friend.id}
                            bgColor="white"
                            userName={friend.name}
                            userPicture={friend.avatar || PinguAvatar}
                            userStatus={getStatus(friend.name)}
                            variant="USER_PROFILE"
                        />
                    ))
                ) : (
                    <div className="flex items-center justify-center w-full h-[68px] px-[6px] sm:px-[16px] md:px-[26px] gap-[10px]">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="w-full h-full flex flex-col justify-center gap-1">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-[100px]" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
