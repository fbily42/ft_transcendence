// import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import LeaderBoard from "../../components/Dashboard/Leaderboard/Leaderboard";
import CardsDashboard from "@/components/Dashboard/Cards/CardsDashboard";
import { useState } from "react";
import { useCookies } from 'react-cookie';
import axios from 'axios';

function Dashboard() {

	const [user, setUser] = useState();
	// const [cookies] = useCookies(['jwt']);
	
	//UseEffect mandatory for async user data update
	useEffect(() => {
		const fetchData = async () => {
		  try {
			//api call with jwt as authorization
			const response = await axios.get("http://localhost:3333/user/me", {
				withCredentials: true
			});

			//Update the user data
			setUser(response.data);
		} catch (error) {
			console.log("Error getdata", error);
		}
	};

	const pollData = async () => {
		//First api call
		fetchData();

		//Set the interval between each api call
		const pollingInterval = setInterval(() => {
			fetchData();
		}, 5000);

		//Clear when the component is unmount
		return () => clearInterval(pollingInterval);
	};

		//Launch the loop
		pollData();

	}, []);

	return (
		<>
			<div className="flex flex-col justify-between pl-[122px] pb-[36px] pr-[36px] h-[90vh] bg-red-100 gap-[36px]">
				<div className="flex w-[100%] h-[50%] justify-between gap-[36px]">
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
								content={user ? user.nb_game : 0}
							></CardsDashboard>
						</div>
						<div className="bg-yellow-100 h-[30%]">
							<CardsDashboard
								title="Game Won"
								content={user ? user.nb_win : 0}
							></CardsDashboard>
						</div>
					</div>
				</div>
				<div className="w-[100%] h-[50%] bg-red-300 bg-white rounded-md border">
					<LeaderBoard />
				</div>
			</div>
		</>
	);
}

export default Dashboard;
