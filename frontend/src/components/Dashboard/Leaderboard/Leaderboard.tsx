import React, { useState, useEffect } from "react";
import { LeaderboardData, columns } from "./columns";
import { DataTable } from "./data-table";
import axios from "axios";
import { useCookies } from "react-cookie";

export default function LeaderBoard(): JSX.Element {
	const [data, setData] = useState<LeaderboardData[]>([]);
	const [cookies] = useCookies(["jwt"]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				//api call with jwt as authorization
				const response = await axios.get(
					"http://localhost:3333/user/leaderboard",
					{
						headers: { Authorization: `Bearer ${cookies.jwt}` },
					}
				);

				//Update the user data
				setData(response.data);
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
	}, [cookies]);

	console.log(data);

	return (
		<div className="h-[100%]">
			{data.length > 0 && <DataTable columns={columns} data={data} />}
		</div>
	);
}
