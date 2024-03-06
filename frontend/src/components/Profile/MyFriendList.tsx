import { getMyFriends } from '@/lib/Dashboard/dashboard.requests'
import { FriendData } from '@/lib/Dashboard/dashboard.types'
import { useQuery } from '@tanstack/react-query'
import UserCards from '../User/userCards/UserCards'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import NoFriends from '@/assets/other/NoFriends.png'

export default function MyFriendList(): JSX.Element {
    const { data: myFriends } = useQuery<FriendData[]>({
        queryKey: ['userFriend'],
        queryFn: getMyFriends,
    })

    const webSocket = useWebSocket() as WebSocketContextType

    function getStatus(name: string): string {
        const webSocketStatus = webSocket.usersOn.has(name)
        let friendStatus: string

        if (webSocketStatus === true) {
			if (webSocket.inGame?.includes(name)) {
				friendStatus = 'In Game'
			}
			else {
            	friendStatus = 'Online'
			}
        } else {
            friendStatus = 'Offline'
        }
        return friendStatus
    }

    return (
        <div className="h-full">
            <div className="bg-white w-full flex flex-col rounded-[26px] md:rounded-[30px] lg:rounded-[36px] h-full">
                <h2 className="p-[20px] text-gray-500">Friends</h2>
                {myFriends && myFriends.length > 0 ? (
                    myFriends.map((friend: FriendData) => (
                        <div key={friend.id}>
                            <UserCards
                                id={friend.id}
                                bgColor="transparent"
                                userName={friend.pseudo}
                                userPicture={friend.avatar!}
                                userStatus={getStatus(friend.name)}
                            />
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center h-full">
                        <img src={NoFriends} alt="no friends" />
                        <span className="w-[200px]">
                            <p className="text-center font-semibold">Oh no!</p>
                            <p className="text-center">
                                You have no friends yet.
                            </p>
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}
