import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type DropdownCardProps = {
    variant: 'USER_PROFILE' | 'CHAT'
    id: string
}

const DropdownCard: React.FC<DropdownCardProps> = ({ variant, id }) => {
    const navigate = useNavigate()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={'ghost'} size={'smIcon'}>
                    <MoreHorizontal size={'16px'} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col gap-1">
                <DropdownMenuItem asChild>
                    <Button className="w-full">PLay Pingu</Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Button
                        className="w-full"
                        onClick={() => {
                            navigate(`/profile/${id}`)
                        }}
                    >
                        See Profile
                    </Button>
                </DropdownMenuItem>
                {variant === 'USER_PROFILE' ? (
                    <>
                        <DropdownMenuItem asChild>
                            <Button className="w-full">Delete</Button>
                        </DropdownMenuItem>
						<DropdownMenuItem asChild>
                            <Button className="w-full">Chat</Button>
                        </DropdownMenuItem>
                    </>
                ) : (
                    <>
                        <DropdownMenuItem asChild>
                            <Button className="w-full">Kick</Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Button className="w-full">Ban</Button>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DropdownCard
