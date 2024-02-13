import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { SubmitHandler, useForm } from 'react-hook-form'

import React, { useRef, KeyboardEvent } from 'react';
import { Search } from "lucide-react";
import { XCircle } from "lucide-react";
import axios from "axios";
import { useWebSocket } from "@/context/webSocketContext";
import pingu_duo from "./../../assets/Pong_page/duo.png"
import { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";


// interface GameFormprops {
// 	onClose: () => void;
// }
function GameForm({ closeDialog }){
	const [search, setSearch] = useState('');
	const socket = useWebSocket();
	// const [results, setResults] = useState([]);


	
	const handleSearch = async(event: any) => {
		event.preventDefault();
		try{
			//verifier que la personne est en ligne pour envoyer l'invitation 
			const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/game/invitGame/${search}`,{
				withCredentials: true,
			});
		
			if (socket)
			{
				
				socket.emit('game invitation', {to: search, game:response.data});
			}
		} catch (error)
		{
		
		}

	
   		// setResults([search]); // Mettez à jour cette ligne pour afficher les vrais résultats
    	setSearch('');
	};
	
	let roomcounter = 0;
	const navigate = useNavigate();
	async function handleMatchmaking(event: any)
	{
		event.preventDefault();//a quoi cela sert
		const roomName = 'room' + roomcounter++;
		//mettre fin au matchmaking des qu'il ferme le modal
		if (socket)
		{
			socket.webSocket?.on('JoinParty', (message: string) => {
				let words = message.split(' '); 
				let lastWord = words[words.length - 1];
				console.log(lastWord);
				if (message.startsWith('You have joined'))
				{
					navigate('/pong');
					closeDialog();
					// console.log('join :', lastWord);//faire rejoindre la partie 
				}
				else if (message.startsWith('You have created'))
				{
					closeDialog();
					// console.log('created :', lastWord);
				}
				if(message.startsWith('Ready'))
				{
					//possiblement faire un emit pour ensuite pouvoir le recuperer dans le game pour avoir le nom de la room 
					navigate('/pong');
					closeDialog();
					// console.log('Start the Game');//faire rejoindre la partie
				}
				else
					return; //error
			})
			socket.webSocket?.emit('JoinRoom', roomName);
			// socket.emit('JoinRoom', roomName);
	
		}
		//verifier qu'il y a une personne en ligne au moins autre que le client 
			// socket.emit('game invitation random');


	}
	

	return (
		<div className=" p-5">
			<div className="fixed-0 ">
				<img 
				src={pingu_duo} 
				alt="Pingu with Robby"
				className="absolute top-[-80px] right-0"
				/>
			</div>
			<div className="mb-[20px] bg-blue-500" style={{ height: '50%' }} >
				<p className="mb-[14px]">Choose an online friend to play with </p>
				<form onSubmit={handleSearch} className="w-full mb-10 border-2 border-black rounded-xl p-2 pr-2 mb-4 realtive flex items-center ">
					<Search className=""/>
					<div className="ml-[10px] bg-red-500">
						<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Rechercher des amis"
						className="outline-none w-[350px]"
						onBlur={(e) => { e.target.style.outline = 'none'; }}
						required
						/>
					</div>
					<XCircle className="fixed-0 "/>
				</form>
			</div>
			{/* Permet d'avoir un historique des recherchers */}
			{/* <ul>
				{results.map((result, index) => (
					<li key={index}>{result}</li>
				))}
			</ul> */}
			<div className="mb-[20px] bg-blue-300" style={{ height: '50%' }}>
				<p className="mb-[14px]">Or find a random player </p>
				<form onSubmit={handleMatchmaking}>
					<button className="w-full flex justify-center border-2 bg-blue-200 border-blue-500 rounded-xl p-2 pr-2 mb-4" type="submit">Submit</button>
				</form>
				</div>
		</div>
	)
};


export default GameForm;