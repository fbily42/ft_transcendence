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
        // <div>
        //     <h2>Friends</h2>
        //     <div className="bg-white w-full flex flex-col rounded-[26px] md:rounded-[30px] lg:rounded-[36px] ">
        //         {friends && friends.length > 0 ? (
        //             friends.map((friend: FriendData) => (
        //                 <UserCards
        //                     id={friend.id.toString()}
        //                     key={friend.id}
        //                     bgColor="white"
        //                     userName={friend.name}
        //                     userPicture={friend.avatar || PinguAvatar}
        //                     userStatus={getStatus(friend.name)}
        //                     variant="USER_PROFILE"
        //                 />
        //             ))
        //         ) : (
        //             <div className="flex items-center justify-center w-full h-[68px] px-[6px] sm:px-[16px] md:px-[26px] gap-[10px]">
        //                 <Skeleton className="h-12 w-12 rounded-full" />
        //                 <div className="w-full h-full flex flex-col justify-center gap-1">
        //                     <Skeleton className="h-4 w-full" />
        //                     <Skeleton className="h-4 w-[100px]" />
        //                 </div>
        //             </div>
        //         )}
        //     </div>
        // </div>

        <div>
            <h2 className="p-[20px] text-gray-500">Friends</h2>
            <div className="bg-white w-full flex flex-col rounded-[26px] md:rounded-[30px] lg:rounded-[36px] ">
                {data && data.length > 0 ? (
                    data.map((data: UserData) => (
                        <UserCards
                            id={data.id.toString()}
                            key={data.id}
                            bgColor="white"
                            userName={data.name}
                            userPicture={data.avatar || PinguAvatar}
                            userStatus={getStatus(data.name)}
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
