import { Button } from '@/components/ui/button'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import {
    acceptFriend,
    addNewFriend,
    getFriendRequest,
    getMyFriends,
    getPendingInvitations,
    getUserById,
    removeFriend,
} from '@/lib/Dashboard/dashboard.requests'
import { FriendData, UserData } from '@/lib/Dashboard/dashboard.types'
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

    const { data: user } = useQuery<UserData, Error>({
        queryKey: ['users', param.id],
        queryFn: () => getUserById(param.id!),
    })

    const queryClient = useQueryClient()
    const socket = useWebSocket() as WebSocketContextType

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

    function directMessage(name: string) {
        socket.webSocket?.emit('privateMessage', name)
    }

    return (
        <div>
            {!isFriend && !isPending && !isRequested && (
                <div>
                    <Button
                        className="w-full"
                        onClick={() => addNewFriendMutation.mutate(param.id!)}
                    >
                        Add Friend
                    </Button>
                </div>
            )}
            {isFriend && (
                <>
                    <div className="w-full flex gap-[12px] md:gap-[8px] lg:gap-[26px] no-scrollbar">
                        <Button
                            className="w-full"
                            onClick={() => directMessage(user?.name!)}
                        >
                            Send PM
                        </Button>
                        <Button
                            className="w-full"
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
                    <Button className="w-full" variant={'outline'}>
                        Pending Invitation
                    </Button>
                </div>
            )}
            {isRequested && !isFriend && (
                <div>
                    <Button
                        className="w-full"
                        onClick={() => acceptFriendMutation.mutate(param.id!)}
                    >
                        Accept Friendship
                    </Button>
                </div>
            )}
        </div>
    )
}
