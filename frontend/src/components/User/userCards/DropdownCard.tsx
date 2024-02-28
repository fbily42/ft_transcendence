import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuGroup,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type DropdownCardProps = {
    variant?: 'FRIEND' | 'OTHER'
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
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <div
                            className="w-full"
                            onClick={() => {
                                navigate(`/profile/${id}`)
                            }}
                        >
                            See Profile
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="" />
                    <DropdownMenuItem asChild>
                        <div className="w-full">Play Pingu</div>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <div className="w-full">Chat</div>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                {variant === 'FRIEND' ? (
                    <>
                        <DropdownMenuGroup>
                            {/* <DropdownMenuItem asChild>
                                <div className="w-full">Remove</div>
                            </DropdownMenuItem> */}
                        </DropdownMenuGroup>
                    </>
                ) : (
                    <></>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DropdownCard
