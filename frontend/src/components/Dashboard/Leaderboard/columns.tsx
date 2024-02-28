import { ColumnDef } from '@tanstack/react-table'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import PinguAvatar from '../../../assets/empty-state/pingu-face.svg'
import { LeaderboardData } from '@/lib/Dashboard/dashboard.types'

export const columns: ColumnDef<LeaderboardData>[] = [
    {
        accessorKey: 'rank',
        header: 'Rank',
    },
    {
        accessorKey: 'name',
        header: 'Player',
        cell: ({ row }) => {
            const playerName: string | undefined = row.original.pseudo

            if (playerName !== undefined) {
                // const firstChar = playerName.charAt(0)

                return (
                    <div className="text-right font-medium flex items-center gap-[20px]">
                        <Avatar className="border-[3px] rounded-full border-customDarkBlue">
                            <AvatarImage
                                className="rounded-full object-cover w-[40px] h-[40px]"
                                src={row.original.avatar}
                            />
                            <AvatarFallback>
                                <img src={PinguAvatar} alt="pingu" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-right font-medium">
                            {playerName}
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className="text-right font-medium">
                        Player name is undefined.
                    </div>
                )
            }
        },
    },
    {
        accessorKey: 'score',
        header: () => <div className="text-right">Score</div>,
        cell: ({ row }) => {
            const score: number = row.original.score

            return <div className="text-right font-medium">{score}</div>
        },
    },
]
