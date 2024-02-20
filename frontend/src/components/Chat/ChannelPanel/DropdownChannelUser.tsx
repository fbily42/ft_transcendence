import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import {
    ban,
    kick,
    mute,
    setAdmin,
    setMember,
    unban,
    unmute,
} from '@/lib/Chat/chat.requests'
import { CmdData, DropdownChannelUserProps } from '@/lib/Chat/chat.types'
import { getUserMe } from '@/lib/Dashboard/dashboard.requests'
import { UserData } from '@/lib/Dashboard/dashboard.types'
import { useQuery } from '@tanstack/react-query'
import { MoreHorizontal } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const DropdownChannelUser: React.FC<DropdownChannelUserProps> = ({
    targetId,
    targetName,
    role,
    targetRole,
}) => {
    const navigate = useNavigate()
    const socket = useWebSocket() as WebSocketContextType
    const [searchParams, setSearchParams] = useSearchParams()
    const channel: string | null = searchParams.get('channelId')
    const { data: me } = useQuery<UserData>({
        queryKey: ['me'],
        queryFn: getUserMe,
    })
    const cmdData: CmdData = {
        userId: me?.id.toString(),
        targetId: targetId,
        targetName: targetName,
        channel: channel,
    }

    return targetId === me?.id.toString() ? null : (
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
                        <DropdownMenuItem
                            className="w-full"
                            onClick={() => kick(cmdData, socket)}
                        >
                            Kick
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="w-full"
                            onClick={() => ban(cmdData, socket)}
                        >
                            Ban
                        </DropdownMenuItem>
                        <>
                            {targetRole === 'admin' ? (
                                <></>
                            ) : targetRole === 'muted' ? (
                                <DropdownMenuItem
                                    className="w-full"
                                    onClick={() => {
                                        unmute(cmdData, socket)
                                    }}
                                >
                                    Unmute
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem
                                    className="w-full"
                                    onClick={() => {
                                        mute(cmdData, socket)
                                    }}
                                >
                                    Mute
                                </DropdownMenuItem>
                            )}
                        </>
                        <>
                            {targetRole === 'admin' ? (
                                <DropdownMenuItem
                                    className="w-full"
                                    onClick={() => {
                                        setMember(cmdData, socket)
                                    }}
                                >
                                    Set member
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem
                                    className="w-full"
                                    onClick={() => {
                                        setAdmin(cmdData, socket)
                                    }}
                                >
                                    Set admin
                                </DropdownMenuItem>
                            )}
                        </>
                    </>
                ) : null}
                {role === 'admin' && targetRole !== 'banned' ? (
                    <>
                        {targetRole === ('member' || 'muted') ? (
                            <>
                                <DropdownMenuItem
                                    className="w-full"
                                    onClick={() => {
                                        kick(cmdData, socket)
                                    }}
                                >
                                    Kick
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="w-full"
                                    onClick={() => {
                                        ban(cmdData, socket)
                                    }}
                                >
                                    Ban
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="w-full"
                                    onClick={() => {
                                        setAdmin(cmdData, socket)
                                    }}
                                >
                                    Set Admin
                                </DropdownMenuItem>
                            </>
                        ) : null}
                        <>
                            {targetRole === 'admin' || 'owner' ? (
                                <></>
                            ) : targetRole === 'muted' ? (
                                <DropdownMenuItem
                                    className="w-full"
                                    onClick={() => {
                                        unmute(cmdData, socket)
                                    }}
                                >
                                    Unmute
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem
                                    className="w-full"
                                    onClick={() => {
                                        mute(cmdData, socket)
                                    }}
                                >
                                    Mute
                                </DropdownMenuItem>
                            )}
                        </>
                    </>
                ) : null}
                {['owner', 'admin'].includes(role) &&
                targetRole === 'banned' ? (
                    <DropdownMenuItem
                        className="w-full"
                        onClick={() => {
                            unban(cmdData, socket)
                        }}
                    >
                        Unban
                    </DropdownMenuItem>
                ) : null}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DropdownChannelUser
