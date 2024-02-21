import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import { MoreHorizontal } from 'lucide-react'

type DropdownChannelProps = {
    userName: string
    channelName: string
    role: string
}

export type LeaveChannelData = {
    user: string
    channel: string
    role: string
}

export function leaveChannel(
    cmd: LeaveChannelData,
    socket: WebSocketContextType
) {
    socket?.webSocket?.emit('quitChannel', cmd)
}

const DropdownChannel: React.FC<DropdownChannelProps> = ({
    userName,
    channelName,
    role,
}) => {
    const socket = useWebSocket() as WebSocketContextType
    const cmd: LeaveChannelData = {
        user: userName,
        channel: channelName,
        role: role,
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={'ghost'} size={'smIcon'}>
                    <MoreHorizontal size={'16px'} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col gap-1">
                <DropdownMenuItem
                    className="w-full"
                    onClick={() => {
                        leaveChannel(cmd, socket)
                    }}
                >
                    Leave
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DropdownChannel
