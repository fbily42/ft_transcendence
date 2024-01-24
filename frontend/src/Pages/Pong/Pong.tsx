import { Button } from '@/components/ui/button'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Dashboard from '../Dashboard/Dashboard'
import Chat from '../Chat/Chat';

function Pong() {

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');
	
		function updateGame() {
			// Mettre à jour les positions de la raquette et de la balle
		}
	
		function drawGame() {
			context.clearRect(0, 0, canvas.width, canvas.height);
			// Dessiner la raquette, la balle, le score, etc.
		}
	
		function gameLoop() {
			updateGame();
			drawGame();
			requestAnimationFrame(gameLoop);
		}
	
		gameLoop();
	}, []);
	

  return (
    <div className='flex justify-center items-center'>
		<Link to="/dashboard" >
			<Button>PLAY</Button>
		</Link>
	</div>
  )
}

export default Pong