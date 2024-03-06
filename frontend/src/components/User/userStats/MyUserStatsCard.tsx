import { getUserMe } from '@/lib/Dashboard/dashboard.requests'
import { UserData } from '@/lib/Dashboard/dashboard.types'
import { useQuery } from '@tanstack/react-query'
import { ChevronsUp, Crown, Frown } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function MyUserStatsCard(): JSX.Element {
    const { data: me } = useQuery<UserData>({
        queryKey: ['me'],
        queryFn: getUserMe,
    })

    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 900)

    const handleResize = () => {
        setIsMobile(window.innerWidth < 900)
    }

    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize)

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <div
            id="My stats"
            className="w-full p-[10px] md:p-[10px] lg:p-[30px] flex justify-evenly items-center"
        >
            <div id="My rank" className="flex flex-col items-center">
                <h1 className="text-base sm:text-md md:text-lg lg:text-2xl font-semibold">
                    {me?.rank}
                </h1>
                <div>
                    {isMobile ? (
                        <ChevronsUp size={20} />
                    ) : (
                        <p className="text-center text-[12px]">My Rank</p>
                    )}
                </div>
            </div>
            <div className="border-l-2 h-full border-l-[#C1E2F7] rounded-full"></div>
            <div id="Games won" className="flex flex-col items-center">
                <h1 className="text-base sm:text-md md:text-lg lg:text-2xl font-semibold">
                    {me?.wins}
                </h1>
                <div>
                    {isMobile ? (
                        <Crown size={20} />
                    ) : (
                        <p className="text-center text-[12px]">Games won</p>
                    )}
                </div>
            </div>
            <div className="border-l-2 h-full border-l-[#C1E2F7] rounded-full"></div>

            <div id="Total Games" className="flex flex-col items-center">
                <h1 className="text-base sm:text-md md:text-lg lg:text-2xl font-semibold">
                    {me?.looses}
                </h1>
                <div>
                    {isMobile ? (
                        <Frown size={20} />
                    ) : (
                        <p className="text-center text-[12px]">Games lost</p>
                    )}
                </div>
            </div>
        </div>
    )
}
