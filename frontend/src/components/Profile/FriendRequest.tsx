import { getFriendRequest } from '@/lib/Dashboard/dashboard.requests'
import { FriendData } from '@/lib/Dashboard/dashboard.types'
import { useQuery } from '@tanstack/react-query'
import UserCards from '../User/userCards/UserCards'
import PinguAvatar from '../../assets/empty-state/pingu-face.svg'

export default function FriendRequest(): JSX.Element {
    const { data: friendRequest } = useQuery<FriendData[]>({
        queryKey: ['request'],
        queryFn: getFriendRequest,
    })

    return (
        <div>
            <h2 className="p-[20px] text-gray-500">Friend Request</h2>
            <div className="overflow-y-auto max-h-[130px] no-scrollbar">
                {friendRequest && friendRequest.length > 0 ? (
                    friendRequest.map((friend: FriendData) => (
                        <div key={friend.id}>
                            <UserCards
                                id={friend.id}
                                bgColor="white"
                                userName={friend.pseudo}
                                userPicture={friend.avatar || PinguAvatar}
                                userStatus=""
                            />
                        </div>
                    ))
                ) : (
                    <div>No pending friend requests</div>
                )}
            </div>
        </div>
    )
}
