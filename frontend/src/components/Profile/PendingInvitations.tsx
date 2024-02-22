import { getPendingInvitations } from '@/lib/Dashboard/dashboard.requests'
import { FriendData } from '@/lib/Dashboard/dashboard.types'
import { useQuery } from '@tanstack/react-query'
import UserCards from '../User/userCards/UserCards'

export default function PendingInvitations() {
    const { data: friendInvites } = useQuery<FriendData[]>({
        queryKey: ['pending'],
        queryFn: getPendingInvitations,
    })
    return (
        <div>
            {friendInvites && friendInvites.length > 0 ? (
                friendInvites.map((friend: FriendData) => (
                    <div key={friend.id}>
                        <h2 className="p-[20px] text-gray-500">
                            Pending Invitations
                        </h2>
                        <UserCards
                            id={friend.id}
                            bgColor="white"
                            userName={friend.name}
                            userPicture={friend.avatar || ''}
                            userStatus=""
                            variant="OTHER"
                        />
                    </div>
                ))
            ) : (
                <div>No pending friend invitations</div>
            )}
        </div>
    )
}
