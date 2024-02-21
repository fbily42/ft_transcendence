import { getFriendRequest } from '@/lib/Dashboard/dashboard.requests'
import { FriendData } from '@/lib/Dashboard/dashboard.types'
import { useQuery } from '@tanstack/react-query'
import UserCards from '../User/userCards/UserCards'
import PinguAvatar from '../../assets/empty-state/pingu-face.svg'

export default function FriendRequest() {
    const { data: friendRequest } = useQuery<FriendData[]>({
        queryKey: ['request'],
        queryFn: getFriendRequest,
    })

    return (
        <div>
            {friendRequest && friendRequest.length > 0 ? (
                friendRequest.map((friend: FriendData) => (
                    <div key={friend.id}>
                        <h2 className="p-[20px] text-gray-500">
                            Friend Request
                        </h2>
                        <UserCards
                            id={friend.id}
                            bgColor="white"
                            userName={friend.name}
                            userPicture={friend.avatar || PinguAvatar}
                            userStatus=""
                            variant="USER_PROFILE"
                        />
                    </div>
                ))
            ) : (
                <div>No pending friend requests</div>
            )}
        </div>
    )
}
