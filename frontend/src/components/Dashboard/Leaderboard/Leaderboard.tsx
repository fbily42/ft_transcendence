import React, { useState, useEffect } from "react";
import { LeaderboardData, columns } from "./columns";
import { DataTable } from "./data-table";
import axios from "axios";
import instance from "@/axiosConfig";

export default function LeaderBoard(): JSX.Element {
	const [data, setData] = useState<LeaderboardData[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				//api call with jwt as authorization
				const response = await axios.get(
					"http://localhost:3333/user/leaderboard",
					{
						withCredentials: true,
					}
				);

				// Sort the data by score in descending order
				const sortedData = response.data.sort(
					(a: LeaderboardData, b: LeaderboardData) =>
						b.score - a.score
				);

				// Assign ranks based on the position in the sorted array
				const rankedData = sortedData.map(
					(user: LeaderboardData, index: number) => ({
						...user,
						rank: index + 1,
					})
				);

				//Update the user data
				// setData(response.data);
				setData(rankedData);
				// Update the ranks in the backend
				await axios.post(
					"http://localhost:3333/user/updateRanks",
					rankedData,
					{
						withCredentials: true,
					}
				);
			} catch (error) {
				console.log("Error getdata", error);
			}
		};

		const pollData = () => {
			//First api call
			fetchData();

			//Set the interval between each api call
			const pollingInterval = setInterval(async () => {
				fetchData();
			}, 5000);

			//Clear when the component is unmount
			return () => clearInterval(pollingInterval);
		};

		//Launch the loop
		return pollData();

	}, []);

	console.log(data);

	return (
		<div className="h-[100%]">
			{data.length > 0 && <DataTable columns={columns} data={data} />}
		</div>
	);
}
