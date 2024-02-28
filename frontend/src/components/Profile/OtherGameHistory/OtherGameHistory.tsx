import { columns } from './columns'
import { DataTable } from './data-table'
import { useQuery } from '@tanstack/react-query'
import { getGameHistory } from '@/lib/Dashboard/dashboard.requests'
import { GameHistory } from '@/lib/Profile/profile.types'
import { useParams } from 'react-router-dom'

export default function OtherGameHistory(): JSX.Element {
    const param = useParams()
    const { data: games } = useQuery<GameHistory[]>({
        queryKey: ['games'],
        queryFn: () => getGameHistory(param.id!),
    })

    if (!games) {
        return <div className="h-full"></div>
    }
    return (
        <div className="h-full w-full overflow-hidden">
            {games.length > 0 && (
                <DataTable columns={columns} data={games} />
            )}
        </div>
    )
}
