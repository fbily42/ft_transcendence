import { InviteFormValues } from '@/components/Chat/ChannelPanel/Channels/CardInvite'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Socket, io } from 'socket.io-client'
import { toast } from 'sonner'

export type WebSocketContextType = {
    webSocket: Socket | null
    usersOn: Map<string, string[]>
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
    const navigate = useNavigate()

    useEffect(() => {
        const ws: Socket = io(`${import.meta.env.VITE_WSCHAT_URL}`, {
            withCredentials: true,
        })
        setWebSocket(ws)

        ws?.on('channelInvite', (invite: InviteFormValues) => {
            toast(
                `You have been invite to ${invite.channel} by ${invite.sentBy}`,
                {
                    action: {
                        label: 'Go to chat window',
                        onClick: () => navigate('/chat'),
                    },
                }
            )
        })

        ws?.on('users', (users: SocketUsers) => {
            const usersMap: Map<string, string[]> = arrayToMap(users)
			setUsersOn(usersMap)
        })

		ws?.on('privateMessage', () => {
			navigate('/chat')
		})

        return () => {
            if (ws) {
                ws?.off('channelInvite')
                ws?.off('users')
                ws.close()
            }
        }
    }, [])

    return (
        <WebSocketContext.Provider value={{ webSocket, usersOn }}>
            <Outlet />
        </WebSocketContext.Provider>
    )
}
