import { getMyFriends, getUsers } from '@/lib/Dashboard/dashboard.requests'
import { FriendData, UserData } from '@/lib/Dashboard/dashboard.types'
import { useQuery } from '@tanstack/react-query'
import UserCards from '../User/userCards/UserCards'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import { Skeleton } from '../ui/skeleton'
// import PinguAvatar from '../../assets/empty-state/pingu-face.svg'

export default function MyFriendList() {
    const { data } = useQuery<UserData[]>({
        queryKey: ['users'],
        queryFn: getUsers,
    })
    const { data: myFriends } = useQuery<FriendData[]>({
        queryKey: ['userFriend'],
        queryFn: getMyFriends,
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
    console.log(myFriends)

    return (
        <div>
            <h2 className="p-[20px] text-gray-500">All</h2>
            <div className="bg-white w-full flex flex-col rounded-[26px] md:rounded-[30px] lg:rounded-[36px] ">
                {data ? (
                    data.map((data: UserData) => (
                        <UserCards
                            id={data.id}
                            key={data.id}
                            bgColor="white"
                            userName={data.pseudo}
                            userPicture={data.avatar!}
                            userStatus={getStatus(data.name)}
                            variant="OTHER"
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
            <h2 className="p-[20px] text-gray-500">Friends</h2>
            <div className="bg-white w-full flex flex-col rounded-[26px] md:rounded-[30px] lg:rounded-[36px] ">
                {myFriends ? (
                    myFriends.map((friend: FriendData) => (
                        <UserCards
                            id={friend.id}
                            key={friend.id}
                            bgColor="white"
                            userName={friend.pseudo}
                            userPicture={friend.avatar!}
                            userStatus={getStatus(friend.name)}
                            variant="FRIEND"
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
