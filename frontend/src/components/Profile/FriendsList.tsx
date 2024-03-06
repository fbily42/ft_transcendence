import { FriendData, UserData } from '@/lib/Dashboard/dashboard.types'
import PinguAvatar from '../../assets/empty-state/pingu-face.svg'
import UserCards from '../User/userCards/UserCards'
import { getFriends, getUserById } from '@/lib/Dashboard/dashboard.requests'
import { useQuery } from '@tanstack/react-query'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import { useParams } from 'react-router-dom'
import NoFriends from '@/assets/other/NoFriends.png'

export default function FriendsList(): JSX.Element {
    const param = useParams<string>()

    const { data: friends } = useQuery<FriendData[]>({
        queryKey: ['userFriend'],
        queryFn: () => getFriends(param.id!),
    })

    const { data: user } = useQuery<UserData>({
        queryKey: ['users', param.id],
        queryFn: () => getUserById(param.id!),
    })

    const webSocket = useWebSocket() as WebSocketContextType

    function getStatus(name: string): string {
        const webSocketStatus = webSocket.usersOn.has(name)
        let friendStatus: string

        if (webSocketStatus === true) {
            if (webSocket.inGame?.includes(name)) {
                friendStatus = 'In Game'
            } else {
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
                <div className="overflow-y-auto max-h-[300px] no-scrollbar">
                    {friends && friends.length > 0 ? (
                        friends.map((friend: FriendData) => (
                            <div key={friend.id}>
                                <UserCards
                                    id={friend.id.toString()}
                                    bgColor="transparent"
                                    userName={friend.pseudo}
                                    userPicture={friend.avatar || PinguAvatar}
                                    userStatus={getStatus(friend.name)}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center h-full">
                            <img src={NoFriends} alt="no friends" />
                            <span className="w-[200px]">
                                <p className="text-center font-semibold">
                                    Oh no!
                                </p>
                                <p className="text-center">
                                    {user?.pseudo} has no friends yet.
                                </p>
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
