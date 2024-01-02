//commande pour avoir d'un coup la config: rfce
// import { Button } from "@/components/ui/button";
import React from "react";
import LeaderBoard from "../../components/Dashboard/Leaderboard/Leaderboard";
import CardsDashboard from "@/components/Dashboard/Cards/CardsDashboard";



function Dashboard() {
	return (
		<>
			<div className="flex flex-col justify-between pl-[122px] pb-[36px] pr-[36px] h-[90vh] bg-red-100 gap-[36px]">
				<div className="flex w-[100%] h-[50%] justify-between gap-[36px]">
					<div className="bg-blue-300 w-[80%] h-[100%]">Div1</div>
					<div className="flex flex-col w-[20%] h-[100%] justify-between">
						<div className="bg-yellow-100 h-[30%]">
							<CardsDashboard
								title="My Rank"
								content={6}
							></CardsDashboard>
						</div>
						<div className="bg-yellow-100 h-[30%]">
							<CardsDashboard
								title="Game Played"
								content={17}
							></CardsDashboard>
						</div>
						<div className="bg-yellow-100 h-[30%]">
							<CardsDashboard
								title="Game Won"
								content={11}
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
