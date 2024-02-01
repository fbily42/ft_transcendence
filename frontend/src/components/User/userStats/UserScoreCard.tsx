import { getUserMe } from "@/lib/Dashboard/dashboard.requests"
import { UserData } from "@/lib/Dashboard/dashboard.types"
import { useQuery } from "@tanstack/react-query"

export default function UserScoreCard() {
    const { data } = useQuery<UserData>({
        queryKey: [],
        queryFn: getUserMe,
        refetchInterval: 1000 * 10,
    })
    return (
        <div
            id="My level"
            className="w-full p-[16px] md:p-[26px] lg:p-[36px] border-2 border-[#C1E2F7] rounded-[30px]"
        >
            <div className="w-full flex justify-between">
                <div className="flex inline-block items-center">
                    <div className="">
                        <h1 className="text-base sm:text-md md:text-lg lg:text-2xl font-semibold">
                            My level
                        </h1>
                        <div>
                            <p className="text-[12px]">{data?.score}</p>
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
