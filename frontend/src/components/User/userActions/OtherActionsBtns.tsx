import { Button } from '@/components/ui/button'
import {
    acceptFriend,
    addNewFriend,
    getFriendRequest,
    getPendingInvitations,
    removeFriend,
} from '@/lib/Dashboard/dashboard.requests'
import { FriendData } from '@/lib/Dashboard/dashboard.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

export default function OtherActionsBtns() {
    const param = useParams()
    const { data: friendRequest } = useQuery<FriendData[]>({
        queryKey: ['request'],
        queryFn: getFriendRequest,
    })

    const { data: friendInvites } = useQuery<FriendData[]>({
        queryKey: ['pending'],
        queryFn: getPendingInvitations,
    })

    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: (friendId: string) => acceptFriend(friendId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['myFriends', 'pending'],
            })
        },
    })

    const isFriend = friendRequest?.some((friend) => friend.id === param.id)
    const isPending = friendInvites?.some((invite) => invite.id === param.id)
    const isRequested = friendRequest?.some(
        (request) => request.id === param.id
    )

    return (
        <div>
            {!isFriend && !isPending && !isRequested && (
                <div>
                    <Button onClick={() => addNewFriend(param.id!)}>
                        Add Friend
                    </Button>
                </div>
            )}
            {isFriend && !isRequested && (
                <>
                    <div>
                        <Button>Private Message</Button>
                    </div>
                    <div>
                        <Button
                            variant={'destructive'}
                            onClick={() => removeFriend(param.id!)}
                        >
                            Remove Friend
                        </Button>
                    </div>
                </>
            )}
            {isPending && !isFriend && (
                <div>
                    <Button variant={'outline'}>Pending Invitation</Button>
                </div>
            )}
            {isRequested && (
                <div>
                    <Button onClick={() => mutation.mutate(param.id!)}>
                        Accept Friendship
                    </Button>
                </div>
            )}
        </div>
    )

    // return (
    //     <div>
    //         <div>
    //             <Button onClick={() => addNewFriend(param.id!)}>
    //                 Add Friend
    //             </Button>
    //         </div>
    //         <div>
    //             <Button variant={'outline'}>Pending Invitation</Button>
    //         </div>
    //         <div>
    //             <Button>Accept Friendship</Button>
    //         </div>
    //         <div>
    //             <Button>Private Message</Button>
    //             <Button
    //                 variant={'destructive'}
    //                 onClick={() => removeFriend(param.id!)}
    //             >
    //                 Remove Friend
    //             </Button>
    //         </div>
    //     </div>
    // )
}
