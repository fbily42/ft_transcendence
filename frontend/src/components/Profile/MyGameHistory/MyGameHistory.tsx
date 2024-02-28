import { columns } from './columns'
import { DataTable } from './data-table'
import { useQuery } from '@tanstack/react-query'
import { getMyGameHistory } from '@/lib/Dashboard/dashboard.requests'
import { GameHistory } from '@/lib/Profile/profile.types'
import emptyState from '@/assets/Pong_page/duo.svg'

export default function MyGameHistory(): JSX.Element {
    const { data: myGames } = useQuery<GameHistory[]>({
        queryKey: ['myGames'],
        queryFn: getMyGameHistory,
    })

    if (!myGames || myGames.length === 0) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center">
                <img src={emptyState} alt="emptyState" />
                <span className="w-[200px] py-2">
                    <p className="text-center font-semibold">Oh no!</p>
                    <p className="text-center">Your game history is empty.</p>
                </span>
            </div>
        )
    }
    return (
        <div className="h-full w-full overflow-hidden">
            {myGames.length > 0 && (
                <DataTable columns={columns} data={myGames} />
            )}
        </div>
    )
}
