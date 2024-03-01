import { Button } from '@/components/ui/button'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import {
    acceptFriend,
    addNewFriend,
    getFriendRequest,
    getMyFriends,
    getPendingInvitations,
    getUserById,
    getUserMe,
    removeFriend,
} from '@/lib/Dashboard/dashboard.requests'
import { FriendData, UserData } from '@/lib/Dashboard/dashboard.types'
import {
    QueryClient,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { block, directMessage, unblock } from '@/lib/Chat/chat.requests'
import { CmdData } from '@/lib/Chat/chat.types'

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

    const { data: me } = useQuery<UserData>({
        queryKey: ['me'],
        queryFn: getUserMe,
    })

    const queryClient = useQueryClient() as QueryClient
    const socket = useWebSocket() as WebSocketContextType

    const cmdData: CmdData = {
        userId: me?.id,
        targetId: user?.id!,
        targetName: user?.name!,
        channel: 'none',
    }

    const addNewFriendMutation = useMutation({
        mutationFn: (friendId: string) => addNewFriend(friendId),
        onSuccess: () => {
            socket?.webSocket?.emit('refreshFriendlist', {
                user: me?.name,
                friend: user?.name,
            })
        },
    })

    const acceptFriendMutation = useMutation({
        mutationFn: (friendId: string) => acceptFriend(friendId),
        onSuccess: () => {
            socket?.webSocket?.emit('refreshFriendlist', {
                user: me?.name,
                friend: user?.name,
            })
        },
    })

    const removeFriendMutation = useMutation({
        mutationFn: (friendId: string) => removeFriend(friendId),
        onSuccess: () => {
            socket?.webSocket?.emit('refreshFriendlist', {
                user: me?.name,
                friend: user?.name,
            })
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="w-full" variant="default">
                                    Actions
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-fit ">
                                <DropdownMenuGroup>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            directMessage(user?.name!, socket)
                                        }
                                    >
                                        Send PM
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Play PinguPong
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    {me?.blocked?.includes(user?.name!) ? (
                                        <DropdownMenuItem
                                            className="w-full"
                                            onClick={() => {
                                                unblock(cmdData, queryClient)
                                            }}
                                        >
                                            Unblock
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem
                                            className="w-full"
                                            onClick={() => {
                                                block(cmdData, queryClient)
                                            }}
                                        >
                                            Block
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
