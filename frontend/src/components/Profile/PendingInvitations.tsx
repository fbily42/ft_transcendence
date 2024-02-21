import { getPendingInvitations } from '@/lib/Dashboard/dashboard.requests'
import { FriendData } from '@/lib/Dashboard/dashboard.types'
import { useQuery } from '@tanstack/react-query'
import UserCards from '../User/userCards/UserCards'

export default function PendingInvitations() {
    const {
        data: friendInvites,
        isLoading,
        isError,
    } = useQuery<FriendData[]>({
        queryKey: ['pending'],
        queryFn: getPendingInvitations,
    })
    if (isError) {
        return <div>Error</div>
    }
    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h2 className="p-[20px] text-gray-500">Pending Invitations</h2>
            {/* <div>
                {friendInvites ? (
                    friendInvites.map((friend: FriendData) => (
                        <UserCards
                            id={friend.id.toString()}
                            key={friend.id}
                            bgColor="white"
                            userName={friend.name}
                            userPicture={friend.avatar || ""}
                            userStatus=""
                            variant="USER_PROFILE"
                        />
                    ))
                ) : (
                    <div>No pending friend invitations</div>
                )}
            </div> */}
        </div>
    )
}
