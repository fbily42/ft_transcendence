import { columns } from './columns'
import { DataTable } from './data-table'
import { useQuery } from '@tanstack/react-query'
import { getMyGameHistory } from '@/lib/Dashboard/dashboard.requests'
import { GameHistory } from '@/lib/Profile/profile.types'

export default function MyGameHistory(): JSX.Element {
    const { data: myGames } = useQuery<GameHistory[]>({
        queryKey: ['myGames'],
        queryFn: getMyGameHistory,
    })

    if (!myGames) {
        return <div className="h-full"></div>
    }
    return (
        <div className="h-full w-full overflow-hidden">
            {myGames.length > 0 && (
                <DataTable columns={columns} data={myGames} />
            )}
        </div>
    )
}
