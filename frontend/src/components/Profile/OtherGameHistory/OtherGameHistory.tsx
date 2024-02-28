import { columns } from './columns'
import { DataTable } from './data-table'
import { useQuery } from '@tanstack/react-query'
import { getGameHistory, getUserById } from '@/lib/Dashboard/dashboard.requests'
import { GameHistory } from '@/lib/Profile/profile.types'
import { useParams } from 'react-router-dom'
import emptyState from '@/assets/Pong_page/duo.svg'
import { UserData } from '@/lib/Dashboard/dashboard.types'

export default function OtherGameHistory(): JSX.Element {
    const param = useParams()
    const { data: games } = useQuery<GameHistory[]>({
        queryKey: ['games'],
        queryFn: () => getGameHistory(param.id!),
    })

    const { data: user } = useQuery<UserData>({
        queryKey: ['users', param.id],
        queryFn: () => getUserById(param.id!),
    })

    if (!games || games.length === 0) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center">
                <img src={emptyState} alt="emptyState" />
                <span className="w-[200px] py-2">
                    <p className="text-center font-semibold">Oh no!</p>
                    <p className="text-center">
                        {user?.pseudo} has not played a game yet.
                    </p>
                </span>
            </div>
        )
    }
    return (
        <div className="h-full w-full overflow-hidden">
            {games.length > 0 && <DataTable columns={columns} data={games} />}
        </div>
    )
}
