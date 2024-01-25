import React, { useEffect } from "react";
import LeaderBoard from "../../components/Dashboard/Leaderboard/Leaderboard";
import CardsDashboard from "@/components/Dashboard/Cards/CardsDashboard";
import { useState } from "react";
import axios from "axios";
import instance from "@/axiosConfig";

interface UserData {
    rank: number
    games: number
    wins: number
}

function Dashboard(): JSX.Element {
    const [user, setUser] = useState<UserData | null>(null)

    //UseEffect mandatory for async user data update
    useEffect(() => {
        const fetchData = async () => {
            try {
                //api call with jwt as authorization
                const response = await axios.get<UserData>(
                    `${import.meta.env.VITE_BACKEND_URL}/user/me`,
                    {
                        withCredentials: true,
                    }
                )

                //Update the user data
                setUser(response.data)
            } catch (error) {
                console.log('Error getdata', error)
            }
        }

        const pollData = () => {
            //First api call
            fetchData()

            //Set the interval between each api call
            const pollingInterval = setInterval(async () => {
                fetchData()
            }, 5000)

            //Clear when the component is unmount
            return () => clearInterval(pollingInterval)
        }

        //Launch the loop
        return pollData()
    }, [])

    return (
        <>
            <div className="flex flex-col justify-between pl-[122px] pb-[36px] pr-[36px] h-[90vh] bg-red-100 gap-[36px]">
                <div className="flex w-[100%] h-[50%] justify-between lg:gap-[36px] md:gap-[26px] sm:gap-[26px] gap-[26px]">
                    <div className="bg-blue-300 w-[80%] h-[100%]">Div1</div>
                    <div className="flex flex-col w-[20%] h-[100%] justify-between">
                        <div className="bg-yellow-100 h-[30%]">
                            <CardsDashboard
                                title="My Rank"
                                content={user ? user.rank : 0}
                            ></CardsDashboard>
                        </div>
                        <div className="bg-yellow-100 h-[30%]">
                            <CardsDashboard
                                title="Game Played"
                                content={user ? user.games : 0}
                            ></CardsDashboard>
                        </div>
                        <div className="bg-yellow-100 h-[30%]">
                            <CardsDashboard
                                title="Game Won"
                                content={user ? user.wins : 0}
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
