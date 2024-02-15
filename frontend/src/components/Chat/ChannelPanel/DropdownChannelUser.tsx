import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import { getUserMe } from '@/lib/Dashboard/dashboard.requests'
import { UserData } from '@/lib/Dashboard/dashboard.types'
import { useQuery } from '@tanstack/react-query'
import { MoreHorizontal } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'

type DropdownChannelUserProps = {
	targetId: string
    targetName: string
    role: string
    targetRole: string
}

type KickData = {
	userId: string | undefined,
	targetId: string,
	targetName: string,
	channel: string | null
}
export function kick(data: KickData, socket: WebSocketContextType) {
	socket?.webSocket?.emit('channelKick', data)
}

const DropdownChannelUser: React.FC<DropdownChannelUserProps> = ({
	targetId,
    targetName,
    role,
    targetRole,
}) => {
    const navigate = useNavigate()
	const socket = useWebSocket() as WebSocketContextType
    const [searchParams, setSearchParams] = useSearchParams()
    const channel: string | null = (searchParams.get('channelId'))
	const {data : me} = useQuery<UserData>({
		queryKey: ['me'],
		queryFn: getUserMe
	})

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={'ghost'} size={'smIcon'}>
                    <MoreHorizontal size={'16px'} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col gap-1">
                <DropdownMenuItem className="w-full">
                    Play Pingu
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="w-full"
                    onClick={() => {
                        navigate(`/profile/${targetId}`)
                    }}
                >
                    See Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="w-full" onClick={() => {}}>
                    Block
                </DropdownMenuItem>
                {role === 'owner' && targetRole !== 'banned' ? (
                    <>
                        <DropdownMenuItem className="w-full" onClick={() => kick({userId: me?.id.toString(), targetId: targetId, targetName: targetName, channel: channel}, socket)}>
                            Kick
                        </DropdownMenuItem>
                        <DropdownMenuItem className="w-full" onClick={() => {}}>
                            Ban
                        </DropdownMenuItem>
                        <DropdownMenuItem className="w-full" onClick={() => {}}>
                            {targetRole === 'muted' ? (
                                <p>Mute</p>
                            ) : (
                                <p>Unmute</p>
                            )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="w-full" onClick={() => {}}>
                            {targetRole === 'admin' ? (
                                <p>Set Member</p>
                            ) : (
                                <p>Set Admin</p>
                            )}
                        </DropdownMenuItem>
                    </>
                ) : null}
                {role === 'admin' && targetRole !== 'banned' ? (
                    <>
                        {targetRole === 'member' || 'muted' ? (
                            <>
                                <DropdownMenuItem
                                    className="w-full"
                                    onClick={() => {}}
                                >
                                    Kick
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="w-full"
                                    onClick={() => {}}
                                >
                                    Ban
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="w-full"
                                    onClick={() => {}}
                                >
                                    Set Admin
                                </DropdownMenuItem>
                            </>
                        ) : null}
                        {targetRole === 'muted' ? (
                            <DropdownMenuItem
                                className="w-full"
                                onClick={() => {}}
                            >
                                Unmute
                            </DropdownMenuItem>
                        ) : null}
                    </>
                ) : null}
                {role === 'admin' || 'owner' && targetRole === 'banned' ? (
                    <DropdownMenuItem className="w-full" onClick={() => {}}>
                        Unban
                    </DropdownMenuItem>
                ) : null}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DropdownChannelUser
