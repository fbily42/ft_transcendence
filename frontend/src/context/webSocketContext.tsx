import { InviteFormValues } from '@/lib/Chat/chat.types'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Socket, io } from 'socket.io-client'
import { toast } from 'sonner'

export type WebSocketContextType = {
    webSocket: Socket | null
    usersOn: Map<string, string[]>
    inGame: string[]
}

export type SocketUsers = {
    key: string
    value: string[]
}[]

const arrayToMap = (array: SocketUsers) => {
    return array.reduce((map, obj) => {
        map.set(obj.key, obj.value)
        return map
    }, new Map())
}

const WebSocketContext = createContext<WebSocketContextType | null>(null)

export const useWebSocket = () => useContext(WebSocketContext)

export const WebSocketProvider: React.FC = () => {
    const [webSocket, setWebSocket] = useState<Socket | null>(null)
    const [usersOn, setUsersOn] = useState(new Map<string, string[]>())
    const [inGame, setInGame] = useState<string[]>([])
    const queryClient = useQueryClient() as QueryClient
    const navigate = useNavigate()

    useEffect(() => {
        const ws: Socket = io(`${import.meta.env.VITE_WSCHAT_URL}`, {
            withCredentials: true,
        })
        setWebSocket(ws)

        ws?.on('channelInvite', (invite: InviteFormValues) => {
            toast(
                `You have been invited to ${invite.channel} by ${invite.sentBy}`,
                {
                    action: {
                        label: 'Go to chat window',
                        onClick: () => navigate('/chat'),
                    },
                }
            )
        })
        ws?.on('GameInvitation', (data) => {
            toast(`You have been invited to a game against ${data.pseudo}`, {
                action: {
                    label: 'Accept',
                    onClick: () =>
                        ws?.emit('AcceptInvitation', {
                            friend: data.friend,
                            roomId: data.roomId,
                            level: data.level,
                            map: data.map,
                        }),
                },
                duration: 5000,
                onAutoClose: () => {
                    ws?.emit('DeclineInvitation', {
                        friend: data.friend,
                        roomId: data.roomId,
                    })
                },
                onDismiss() {
                    ws?.emit('DeclineInvitation', {
                        friend: data.friend,
                        roomId: data.roomId,
                    })
                },
            })
        })

        ws?.on('ReadyForGame', (message: string) => {
            if (message.startsWith('Joined')) {
                navigate('/pong')
            }
        })

        ws?.on('users', (users: SocketUsers) => {
            const usersMap: Map<string, string[]> = arrayToMap(users)
            setUsersOn(usersMap)
        })

        ws?.on('inGameUsers', (users: string[]) => {
            setInGame(users)
        })

        ws?.on('privateMessage', () => {
            navigate('/chat')
        })

        ws?.on('kick', (channel: string) => {
            toast(`You have been kicked from ${channel}.`)
            queryClient.invalidateQueries({ queryKey: ['channels'] })
        })

        ws?.on('ban', (channel: string) => {
            toast(`You have been banned from ${channel}.`)
            queryClient.invalidateQueries({ queryKey: ['channels'] })
        })

        ws?.on('unban', (channel: string) => {
            toast(`You have been unbanned from ${channel}.`)
            queryClient.invalidateQueries({ queryKey: ['channels'] })
        })

        ws?.on('setAdmin', (channel: string) => {
            toast(`You have been promoted to administrator on ${channel}.`)
        })

        ws?.on('setMember', (channel: string) => {
            toast(`You have been demoted to member on ${channel}.`)
        })

        ws?.on('muted', (channel: string) => {
            toast(`You have been muted on ${channel}.`)
        })

        ws?.on('unmuted', (channel: string) => {
            toast(`You have been unmuted on ${channel}.`)
        })

        ws?.on('newOwner', (channel: string) => {
            toast(`You have been promoted to owner in ${channel}`)
        })

		ws?.on('blockedUser', () => {
			toast(`Please unblock this user before chatting with them.`)
		})

        ws?.on('refreshFriendlist', () => {
            queryClient.invalidateQueries({ queryKey: ['request'] })
            queryClient.invalidateQueries({ queryKey: ['pending'] })
            queryClient.invalidateQueries({ queryKey: ['friends'] })
            queryClient.invalidateQueries({ queryKey: ['userFriend'] })
        })

        return () => {
            if (ws) {
                const events = [
                    'channelInvite',
                    'users',
                    'privateMessage',
                    'kick',
                    'ban',
                    'unban',
                    'setAdmin',
                    'setMember',
                    'muted',
                    'unmuted',
                    'ReadyForGame',
                    'GameInvitation',
                    'newOwner',
                    'refreshFriendlist',
                    'inGameUsers',
					'blockedUser',
                ]
                events.forEach((event) => {
                    ws.off(event)
                })
                ws.close()
            }
        }
    }, [])

    return (
        <WebSocketContext.Provider value={{ webSocket, usersOn, inGame }}>
            <Outlet />
        </WebSocketContext.Provider>
    )
}
