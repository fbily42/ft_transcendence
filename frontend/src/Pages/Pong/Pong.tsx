import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Dashboard from '../Dashboard/Dashboard'
import Chat from '../Chat/Chat';
import Modal from '@/components/Modal';
import axios from 'axios';


// il y a 2 boutons, un qui permet de chercher un amis, un autre qui permet d'affronter quelqu'un aleatoirement
function Pong() {
		
	const [open, setOpen] = useState<boolean>(false);
	
	useEffect(() => {

		const getChannels = async () => {
			try {
				
				const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/chat/channel/all`,{
					withCredentials: true,
				})
				console.log(response.data);		
			} catch (error) {
				console.log(error);
			}
		};

		getChannels();
	}, []);
	// useEffect(() => {
	// 	const canvas = canvasRef.current;
	// 	const context = canvas.getContext('2d');
	
	// 	function updateGame() {
	// 		// Mettre à jour les positions de la raquette et de la balle
	// 	}
	
	// 	function drawGame() {
	// 		context.clearRect(0, 0, canvas.width, canvas.height);
	// 		// Dessiner la raquette, la balle, le score, etc.
	// 	}
	
	// 	function gameLoop() {
	// 		updateGame();
	// 		drawGame();
	// 		requestAnimationFrame(gameLoop);
	// 	}
	
	// 	gameLoop();
	// }, []);
	

  return (
    <div className='flex justify-center items-center'>
		<Modal open={open} onClose={() => setOpen(false)}>
					<GameForm></GameForm>
				</Modal>
		<Link to="/dashboard" >
			<Button>PLAY</Button>
		</Link>
	</div>
  )
  }

export default Pong