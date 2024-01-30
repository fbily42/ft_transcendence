import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { SubmitHandler, useForm } from 'react-hook-form'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
  } from "@/components/ui/card"


import React, { useRef, KeyboardEvent } from 'react';
import { Search } from "lucide-react";
import axios from "axios";


interface GameFormprops {
	onClose: () => void;
}
function GameForm({onClose}: GameFormprops){
	const [search, setSearch] = useState('');
	const [results, setResults] = useState([]);

	const handleSearch = async(event) => {
		event.preventDefault();
		try{
			const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/game/invitGame/${search}`,{
				withCredentials: true,
			});
			console.log(response.data);	
		} catch (error)
		{
			console.log('probleme')
		}

		console.log(`Recherche pour ${search}`);
   		setResults([search]); // Mettez à jour cette ligne pour afficher les vrais résultats
    	setSearch('');
	};
	

	return (
		<div className="bg-white h-[350px] w-[350px] p-5">
			<div className="mb-[14px] bg-blue-500 ">
				<p className="mb-[14px]">Choose a friend </p>
			<form onSubmit={handleSearch} className="w-full mb-10 border-2 border-black rounded-xl p-2 pr-2 mb-4">
				<input
				type="text"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				placeholder="Rechercher des amis"
				className="outline-none"
				required
				/>

			</form>
			</div>
			{/* <ul>
				{results.map((result, index) => (
					<li key={index}>{result}</li>
				))}
			</ul> */}
			<div className="mb-[14px] bg-blue-300">
				<p className="mb-[14px]">Choose someone randomly</p> 
				<button className="w-full flex justify-center border-2 bg-blue-200 border-blue-500 rounded-xl p-2 pr-2 mb-4" type="submit">Submit</button>
				</div>
		</div>
	)
};


export default GameForm;