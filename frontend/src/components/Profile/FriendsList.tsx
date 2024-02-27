import { FriendData, UserData } from '@/lib/Dashboard/dashboard.types'
import PinguAvatar from '../../assets/empty-state/pingu-face.svg'
import UserCards from '../User/userCards/UserCards'
import { Skeleton } from '../ui/skeleton'
import { getFriends, getUsers } from '@/lib/Dashboard/dashboard.requests'
import { useQuery } from '@tanstack/react-query'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import { useParams } from 'react-router-dom'

export default function FriendsList() {
    const param = useParams()

    const { data, isLoading, isError } = useQuery<UserData[]>({
        queryKey: ['users'],
        queryFn: getUsers,
    })

    const { data: friends } = useQuery({
        queryKey: ['userFriend'],
        queryFn: () => getFriends(param.id!),
    })

    const webSocket = useWebSocket() as WebSocketContextType

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

    return (
        <div>
            <div className="bg-white w-full flex flex-col rounded-[26px] md:rounded-[30px] lg:rounded-[36px] ">
                {friends ? (
                    friends.map((friend: FriendData) => (
                        <div key={friend.id}>
                            <h2 className="p-[20px] text-gray-500">Friends</h2>
                            <UserCards
                                id={friend.id.toString()}
                                bgColor="white"
                                userName={friend.pseudo}
                                userPicture={friend.avatar || PinguAvatar}
                                userStatus={getStatus(friend.name)}
                                variant="OTHER"
                            />
                        </div>
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
