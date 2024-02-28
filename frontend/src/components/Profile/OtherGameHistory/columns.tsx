import { ColumnDef } from '@tanstack/react-table'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import PinguAvatar from '../../../assets/empty-state/pingu-face.svg'
import { GameHistory } from '@/lib/Profile/profile.types'
import { formatDistance } from 'date-fns'

export const columns: ColumnDef<GameHistory>[] = [
    {
        accessorKey: 'Date',
        header: 'Date',
        cell: ({ row }) => {
            return (
                <div className="font-medium">
                    {formatDistance(row.original.createdAt, new Date(), {
                        addSuffix: false,
                    })}
                </div>
            )
        },
    },
    {
        accessorKey: 'Player 1',
        header: 'Player 1',
        cell: ({ row }) => {
            return (
                <div className="font-medium flex items-center gap-[20px]">
                    <Avatar className="border-[3px] rounded-full border-customDarkBlue">
                        <AvatarImage
                            className="rounded-full object-cover w-[40px] h-[40px]"
                            src={row.original.user.avatar}
                        />
                        <AvatarFallback>
                            <img src={PinguAvatar} alt="pingu" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-right font-medium">
                        {row.original.user.pseudo}
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: 'score',
        header: () => <div className="">Score</div>,
        cell: ({ row }) => {
            return (
                <div className="font-medium">
                    {row.original.userScore} : {row.original.opponentScore}
                </div>
            )
        },
    },
    {
        accessorKey: 'Player 2',
        header: 'Player 2',
        cell: ({ row }) => {
            return (
                <div className="text-right font-medium flex items-center gap-[20px]">
                    <Avatar className="border-[3px] rounded-full border-customDarkBlue">
                        <AvatarImage
                            className="rounded-full object-cover w-[40px] h-[40px]"
                            src={row.original.opponent.avatar}
                        />
                        <AvatarFallback>
                            <img src={PinguAvatar} alt="pingu" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-right font-medium">
                        {row.original.opponent.pseudo}
                    </div>
                </div>
            )
        },
    },
]
