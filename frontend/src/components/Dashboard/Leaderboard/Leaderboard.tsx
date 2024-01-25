import { columns } from './columns'
import { DataTable } from './data-table'
import { useQuery } from '@tanstack/react-query'
import { getLeaderboard } from '@/lib/Dashboard/dashboard.requests'
import { LeaderboardData } from '@/lib/Dashboard/dashboard.types'

export default function LeaderBoard(): JSX.Element {
    const { data } = useQuery<LeaderboardData[]>({
        queryKey: [],
        queryFn: getLeaderboard,
        refetchInterval: 1000 * 10,
    })

    if (!data) {
        return <div className="h-full"></div>
    }
    return (
        <div className="h-full">
            {data.length > 0 && <DataTable columns={columns} data={data} />}
        </div>
    )
}
