import { getUserById, getUserMe } from '@/lib/Dashboard/dashboard.requests'
import { UserData } from '@/lib/Dashboard/dashboard.types'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

export default function UserScoreCard() {
    const param = useParams()

    const { data: me } = useQuery<UserData>({
        queryKey: [],
        queryFn: getUserMe,
        refetchInterval: 1000 * 10,
    })

    const { data: friend } = useQuery({
        queryKey: ['users', param.id],
        queryFn: () => getUserById(param.id!),
    })
    return (
        <div
            id="Pseudo"
            className="w-full p-[16px] md:p-[16px] lg:p-[26px] border-2 border-[#C1E2F7] rounded-[30px]"
        >
            <div className="w-full flex justify-between">
                <div className="flex items-center">
                    <div className="">
                        <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl font-semibold">
                            {friend?.pseudo}
                        </h1>
                        <div>
                            <p className="text-[12px]">{friend?.score}</p>
                        </div>
                    </div>
                </div>
                <div className="border-2 border-[#C1E2F7] rounded-full">
                    <div className="w-[71px] h-[71px]"></div>
                </div>
            </div>
        </div>
    )
}
