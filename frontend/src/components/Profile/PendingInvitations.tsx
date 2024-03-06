import { getPendingInvitations } from '@/lib/Dashboard/dashboard.requests'
import { FriendData } from '@/lib/Dashboard/dashboard.types'
import { useQuery } from '@tanstack/react-query'
import UserCards from '../User/userCards/UserCards'

export default function PendingInvitations(): JSX.Element {
    const { data: friendInvites } = useQuery<FriendData[]>({
        queryKey: ['pending'],
        queryFn: getPendingInvitations,
    })
    return (
        <div>
            <h2 className="p-[20px] text-gray-500">Pending Invitations</h2>
            <div className="overflow-y-auto max-h-[130px] no-scrollbar">
                {friendInvites && friendInvites.length > 0 ? (
                    friendInvites.map((friend: FriendData) => (
                        <div key={friend.id}>
                            <UserCards
                                id={friend.id}
                                bgColor="white"
                                userName={friend.pseudo}
                                userPicture={friend.avatar || ''}
                                userStatus=""
                            />
                        </div>
                    ))
                ) : (
                    <div>No pending friend invitations</div>
                )}
            </div>
        </div>
    )
}
