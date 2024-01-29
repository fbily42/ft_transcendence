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
		<div>
			<form onSubmit={handleSearch}>
				<input
				type="text"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				placeholder="Rechercher des amis"
				required
				/>
				<button type="submit">Rechercher</button>

			</form>
			<ul>
				{results.map((result, index) => (
					<li key={index}>{result}</li>
				))}
			</ul>
		</div>
	)
};


export default GameForm;