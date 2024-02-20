import UserCards from '@/components/User/userCards/UserCards'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import { getChannelUsers } from '@/lib/Chat/chat.requests'
import { UserInChannel } from '@/lib/Chat/chat.types'
import { getMyrole, getRole, getUserStatus } from '@/lib/Chat/chat.utils'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import DropdownChannelUser from './DropdownChannelUser'
import { UserData } from '@/lib/Dashboard/dashboard.types'
import { getUserMe } from '@/lib/Dashboard/dashboard.requests'
import { useEffect } from 'react'
import UserCardChannelUser from './UserCardChannelUser'

interface UserListProps {
    channel: string
}

const UserList: React.FC<UserListProps> = ({ channel }) => {
    const socket = useWebSocket() as WebSocketContextType
    const queryClient = useQueryClient()
    const { data: users } = useQuery<UserInChannel[]>({
        queryKey: ['channelUsers', channel],
        queryFn: () => getChannelUsers(channel),
    })

    const { data: me } = useQuery<UserData>({
        queryKey: ['me'],
        queryFn: getUserMe,
    })

    useEffect(() => {
        socket.webSocket?.on('updateChannelUsers', () => {
            queryClient.invalidateQueries({
                queryKey: ['channelUsers', channel],
            })
        })
        return () => {
            socket.webSocket?.off('updateChannelUsers')
        }
    }, [socket])

    return (
        <>
            <div className="flex flex-col overflow-y-auto">
                <h1 className="p-[20px] text-gray-500">Members</h1>
                <div className="flex flex-col overflow-y-auto no-scrollbar">
                    {users?.map((user, index) =>
                        !user.banned && !user.invited ? (
                            <div
                                key={index}
                                className={
                                    getUserStatus(socket, user.name)
                                        ? ''
                                        : 'opacity-50'
                                }
                            >
                                <UserCardChannelUser
                                    targetId={user.userId}
                                    targetName={user.name}
                                    targetPicture={user.photo42}
                                    targetRole={getRole(user)}
                                    userRole={getMyrole(me?.name!, users)}
                                ></UserCardChannelUser>
                            </div>
                        ) : null
                    )}
                </div>
            </div>
            <div>
                {['owner', 'admin'].includes(getMyrole(me?.name!, users!)) ? (
                    <div className="flex flex-col overflow-y-auto">
                        <h1 className="p-[20px] text-gray-500">Banned Users</h1>
                        <div className="flex flex-col overflow-y-auto no-scrollbar">
                            {users?.map((user, index) =>
                                user.banned ? (
                                    <div key={index} className={'opacity-50'}>
                                        <UserCardChannelUser
                                            targetId={user.userId}
                                            targetName={user.name}
                                            targetPicture={user.photo42}
                                            targetRole={getRole(user)}
                                            userRole={getMyrole(
                                                me?.name!,
                                                users
                                            )}
                                        ></UserCardChannelUser>
                                    </div>
                                ) : null
                            )}
                        </div>
                    </div>
                ) : null}
            </div>
        </>
    )
}

export default UserList
