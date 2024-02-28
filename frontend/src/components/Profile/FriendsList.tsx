import { FriendData } from '@/lib/Dashboard/dashboard.types'
import PinguAvatar from '../../assets/empty-state/pingu-face.svg'
import UserCards from '../User/userCards/UserCards'
import { getFriends } from '@/lib/Dashboard/dashboard.requests'
import { useQuery } from '@tanstack/react-query'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import { useParams } from 'react-router-dom'
import NoFriends from '@/assets/other/NoFriends.png'

export default function FriendsList() {
    const param = useParams()

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

    return (
        <div className="h-full">
            <div className="bg-white w-full flex flex-col rounded-[26px] md:rounded-[30px] lg:rounded-[36px] h-full">
                {friends && friends.length > 0 ? (
                    friends.map((friend: FriendData) => (
                        <div key={friend.id}>
                            <h2 className="p-[20px] text-gray-500">Friends</h2>
                            <UserCards
                                id={friend.id.toString()}
                                bgColor="transparent"
                                userName={friend.pseudo}
                                userPicture={friend.avatar || PinguAvatar}
                                userStatus={getStatus(friend.name)}
                                variant="OTHER"
                            />
                        </div>
                    ))
                ) : (
                    <div className="flex items-center h-full">
                        <img src={NoFriends} alt="no friends" />
                    </div>
                )}
            </div>
        </div>
    )
}
