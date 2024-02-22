import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import { DropdownChannelProps, LeaveChannelData } from '@/lib/Chat/chat.types'
import { MoreHorizontal } from 'lucide-react'

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
                <Dialog>
                    <DialogTrigger asChild>
                        <DropdownMenuItem className="w-full text-sm" onSelect={(e) => e.preventDefault()}>
                            Leave
                        </DropdownMenuItem>
                    </DialogTrigger>
                    {role === 'owner' ? (
                        <DialogContent>
                            Owner have to choose a new owner
                        </DialogContent>
                    ) : (
                        <DialogContent>
                            You are about to leave this channel
                        </DialogContent>
                    )}
                </Dialog>
                <div>
                    {role === 'owner' ? (
                        <Dialog>
                            <DialogTrigger asChild>
                                <DropdownMenuItem className="w-full text-sm" onSelect={(e) => e.preventDefault()}>
                                    Set password
                                </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                                You are about to change the password
                            </DialogContent>
                        </Dialog>
                    ) : null}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DropdownChannel
