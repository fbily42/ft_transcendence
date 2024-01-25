import LeaderBoard from '../../components/Dashboard/Leaderboard/Leaderboard'
import CardsDashboard from '@/components/Dashboard/Cards/CardsDashboard'
import { useQuery } from '@tanstack/react-query'
import { getUserMe } from '@/lib/Dashboard/dashboard.requests'

function Dashboard(): JSX.Element {
    const { data } = useQuery({ queryKey: ['me'], queryFn: getUserMe })

    return (
        <>
            <div className="flex flex-col justify-between pl-[122px] pb-[36px] pr-[36px] h-[90vh] bg-red-100 gap-[36px]">
                <div className="flex w-[100%] h-[50%] justify-between lg:gap-[36px] md:gap-[26px] sm:gap-[26px] gap-[26px]">
                    <div className="bg-blue-300 w-[80%] h-[100%]">Div1</div>
                    <div className="flex flex-col w-[20%] h-[100%] justify-between">
                        <div className="bg-yellow-100 h-[30%]">
                            <CardsDashboard
                                title="My Rank"
                                //content={user ? user.rank : 0}
                                content={data?.rank || 0}
                            ></CardsDashboard>
                        </div>
                        <div className="bg-yellow-100 h-[30%]">
                            <CardsDashboard
                                title="Game Played"
                                // content={user ? user.games : 0}
                                content={data?.games || 0}
                            ></CardsDashboard>
                        </div>
                        <div className="bg-yellow-100 h-[30%]">
                            <CardsDashboard
                                title="Game Won"
                                // content={user ? user.wins : 0}
                                content={data?.wins || 0}
                            ></CardsDashboard>
                        </div>
                    </div>
                </div>
                <div className="w-[100%] h-[50%] bg-red-300 bg-white rounded-md border">
                    <LeaderBoard />
                </div>
            </div>
        </>
    )
}

export default Dashboard
