import { InviteFormValues } from '@/components/Chat/ChannelPanel/Channels/CardInvite'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Socket, io } from 'socket.io-client'
import { toast } from 'sonner'

const WebSocketContext = createContext<Socket | null>(null)

export const useWebSocket = () => useContext(WebSocketContext)

export const WebSocketProvider: React.FC = () => {
    const [webSocket, setWebSocket] = useState<Socket | null>(null)
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

        return () => {
            if (ws) {
                ws.close()
            }
        }
    }, [])

    return (
        <WebSocketContext.Provider value={webSocket}>
            <Outlet />
        </WebSocketContext.Provider>
    )
}
