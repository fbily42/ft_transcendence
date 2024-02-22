import { Button } from '@/components/ui/button'
import {
    acceptFriend,
    addNewFriend,
    getFriendRequest,
    getMyFriends,
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

    const { data: friends } = useQuery<FriendData[]>({
        queryKey: ['friends'],
        queryFn: getMyFriends,
    })

    const queryClient = useQueryClient()

    const addNewFriendMutation = useMutation({
        mutationFn: (friendId: string) => addNewFriend(friendId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['request'] })
            queryClient.invalidateQueries({ queryKey: ['pending'] })
            queryClient.invalidateQueries({ queryKey: ['friends'] })
        },
    })

    const acceptFriendMutation = useMutation({
        mutationFn: (friendId: string) => acceptFriend(friendId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['request'] })
            queryClient.invalidateQueries({ queryKey: ['pending'] })
            queryClient.invalidateQueries({ queryKey: ['friends'] })
        },
    })

    const removeFriendMutation = useMutation({
        mutationFn: (friendId: string) => removeFriend(friendId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['request'] })
            queryClient.invalidateQueries({ queryKey: ['pending'] })
            queryClient.invalidateQueries({ queryKey: ['friends'] })
        },
    })

    const isFriend = friends?.some((friend) => friend.id === param.id)
    const isPending = friendInvites?.some((invite) => invite.id === param.id)
    const isRequested = friendRequest?.some(
        (request) => request.id === param.id
    )

    return (
        <div>
            {!isFriend && !isPending && !isRequested && (
                <div>
                    <Button
                        onClick={() => addNewFriendMutation.mutate(param.id!)}
                    >
                        Add Friend
                    </Button>
                </div>
            )}
            {isFriend && (
                <>
                    <div className="w-full flex gap-[12px] md:gap-[8px] lg:gap-[26px] no-scrollbar">
                        <Button>Send PM</Button>
                        <Button
                            variant={'destructive'}
                            onClick={() =>
                                removeFriendMutation.mutate(param.id!)
                            }
                        >
                            Remove
                        </Button>
                    </div>
                </>
            )}
            {isPending && !isFriend && (
                <div>
                    <Button variant={'outline'}>Pending Invitation</Button>
                </div>
            )}
            {isRequested && !isFriend && (
                <div>
                    <Button
                        onClick={() => acceptFriendMutation.mutate(param.id!)}
                    >
                        Accept Friendship
                    </Button>
                </div>
            )}
        </div>
    )
}
