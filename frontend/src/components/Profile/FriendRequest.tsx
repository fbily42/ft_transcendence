import { getFriendRequest } from '@/lib/Dashboard/dashboard.requests'
import { FriendData } from '@/lib/Dashboard/dashboard.types'
import { useQuery } from '@tanstack/react-query'
import UserCards from '../User/userCards/UserCards'
import PinguAvatar from '../../assets/empty-state/pingu-face.svg'

export default function FriendRequest() {
    const {
        data: friendRequest,
        isLoading,
        isError,
    } = useQuery<FriendData[]>({
        queryKey: ['request'],
        queryFn: getFriendRequest,
    })
    if (isError) {
        return <div>Error</div>
    }
    if (isLoading) {
        return <div>Loading...</div>
    }



    return (
        <div>
            <h2 className="p-[20px] text-gray-500">Friend Request</h2>
            <div>
                {friendRequest ? (
                    friendRequest.map((friend: FriendData) => (
                        <UserCards
                            id={friend.id.toString()}
                            key={friend.id}
                            bgColor="white"
                            userName={friend.name}
                            userPicture={friend.avatar || PinguAvatar}
                            userStatus=""
                            variant="USER_PROFILE"
                        />
                    ))
                ) : (
                    <div>No pending friend requests</div>
                )}
            </div>
        </div>
    )
}
