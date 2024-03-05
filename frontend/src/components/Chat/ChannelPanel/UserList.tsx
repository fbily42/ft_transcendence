import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import { getChannelUsers } from '@/lib/Chat/chat.requests'
import { UserInChannel, UserListProps } from '@/lib/Chat/chat.types'
import { getMyrole, getRole, getUserStatus } from '@/lib/Chat/chat.utils'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { UserData } from '@/lib/Dashboard/dashboard.types'
import { getUserMe } from '@/lib/Dashboard/dashboard.requests'
import { useEffect } from 'react'
import CardChannelUser from './CardChannelUser'
import { useNavigate } from 'react-router-dom'

const UserList: React.FC<UserListProps> = ({ channel }) => {
    const socket = useWebSocket() as WebSocketContextType
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { data: users, error: usersError } = useQuery<UserInChannel[]>({
        queryKey: ['channelUsers', channel],
        queryFn: () => getChannelUsers(channel),
        retry: 1,
    })

    const { data: me, error: meError } = useQuery<UserData>({
        queryKey: ['me'],
        queryFn: getUserMe,
        retry: 1,
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

    useEffect(() => {
        if (
            meError?.message.includes('403') ||
            usersError?.message.includes('403')
        ) {
            navigate('/auth')
        }
    }, [usersError, meError])

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
                                <CardChannelUser
                                    targetPseudo={user.pseudo}
                                    targetId={user.userId}
                                    targetName={user.name}
                                    targetPicture={user.avatar}
                                    targetRole={getRole(user)}
                                    userRole={getMyrole(me?.name!, users)}
                                    channel={channel}
                                ></CardChannelUser>
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
                                        <CardChannelUser
                                            targetPseudo={user.pseudo}
                                            targetId={user.userId}
                                            targetName={user.name}
                                            targetPicture={user.avatar}
                                            targetRole={getRole(user)}
                                            userRole={getMyrole(
                                                me?.name!,
                                                users
                                            )}
                                            channel={channel}
                                        ></CardChannelUser>
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
