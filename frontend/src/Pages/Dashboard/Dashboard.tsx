import LeaderBoard from '../../components/Dashboard/Leaderboard/Leaderboard'
import CardsDashboard from '@/components/Dashboard/Cards/CardsDashboard'
import { useQuery } from '@tanstack/react-query'
import { getUserMe } from '@/lib/Dashboard/dashboard.requests'
import Clouds from '../../assets/other/cloud.svg'
import Mountains from '../../assets/other/mountain.svg'
import PinguPlaying from '../../assets/other/Pingu.svg'
import { Button } from '@/components/ui/button'
import { UserData } from '@/lib/Dashboard/dashboard.types'
import { Award, Crown, Gamepad2 } from 'lucide-react'

function Dashboard(): JSX.Element {
    const { data } = useQuery<UserData>({
        queryKey: ['me'],
        queryFn: getUserMe,
    })
    const CloudsArray = new Array(10).fill(Clouds) // Change the number for more or fewer clouds
    const MountainsArray = new Array(10).fill(Mountains) // Change the number for more or fewer mountains

    return (
        <>
            <div
                id="bento"
                className="flex flex-col justify-between pl-[122px] pb-[36px] pr-[36px] h-[90vh] gap-[36px]"
            >
                <div
                    id="top bento"
                    className="flex w-[100%] h-[50%] justify-between lg:gap-[36px] md:gap-[26px] sm:gap-[26px] gap-[26px]"
                >
                    <div
                        id="play box"
                        className="relative bg-customDarkBlue w-[80%] h-full rounded-[36px] overflow-hidden shadow-drop"
                    >
                        <div
                            id="content w/o clouds and mountain"
                            className="z-20 absolute h-full w-full flex items-center pl-6 pb-2 "
                        >
                            <div
                                id="pingu div"
                                className="z-20 h-full w-[40%] flex items-end pl-7 pb-3 "
                            >
                                <img
                                    className="h-fit"
                                    src={PinguPlaying}
                                    alt="Pingu playing ball"
                                ></img>
                            </div>
                            <div
                                id="cta div"
                                className="z-20 h-full w-full flex flex-col items-center justify-center gap-[36px]"
                            >
                                <h1 className="text-white text-wrap text-center text-6xl font-semibold">
                                    Let's Play PinguPong
                                </h1>
                                <Button className="bg-customYellow">
                                    Start a Game
                                </Button>
                            </div>
                        </div>
                        <div
                            id="clouds + mountains"
                            className="z-0 absolute flex flex-col justify-between h-full border-t-[20px] border-b-[20px] border-white"
                        >
                            <div id="clouds" className="flex -space-x-[20px]">
                                {CloudsArray.map((cloud, index) => (
                                    <img key={index} src={cloud} alt="Clouds" />
                                ))}
                            </div>
                            <div id="mountain" className="flex -space-x-[10px]">
                                {MountainsArray.map((mountain, index) => (
                                    <img
                                        key={index}
                                        src={mountain}
                                        alt="Mountains"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div
                        id="stat cards"
                        className="flex flex-col w-[20%] h-[100%] justify-between gap-[20px]"
                    >
                        <div id="rank card" className="bg-yellow-100 h-[30%]">
                            <CardsDashboard
                                title="My Rank"
                                icon={<Award />}
                                //content={user ? user.rank : 0}
                                content={data?.rank || 0}
                            ></CardsDashboard>
                        </div>
                        <div id="game card" className="bg-yellow-100 h-[30%]">
                            <CardsDashboard
                                title="Game Played"
                                icon={<Gamepad2 />}
                                // content={user ? user.games : 0}
                                content={data?.games || 0}
                            ></CardsDashboard>
                        </div>
                        <div id="win card" className="bg-yellow-100 h-[30%]">
                            <CardsDashboard
                                title="Game Won"
                                icon={<Crown />}
                                // content={user ? user.wins : 0}
                                content={data?.wins || 0}
                            ></CardsDashboard>
                        </div>
                    </div>
                </div>
                <div
                    id="bottom bento"
                    className="w-[100%] h-[50%] bg-white rounded-md border"
                >
                    <LeaderBoard />
                </div>
            </div>
        </>
    )
}

export default Dashboard
