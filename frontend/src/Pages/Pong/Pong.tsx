import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Dashboard from '../Dashboard/Dashboard'
import Chat from '../Chat/Chat';
import Modal from '@/components/Modal';
import axios from 'axios';
import GameForm from '@/components/Pong/GameForm';
import Board from './Game';


// faire un decompte en blur ou on voit le jeu en arriere plan, prevoir le cas de la reconnection pour ne pas declencher le decompte dans ce cas la 
// solution possible faire le decompte ici mais envoyer la fonction qui change le useState dans la fonction Board
function Pong() {
	// État pour déterminer si le Board doit être affiché
	const [showBoard, setShowBoard] = useState(false);
	
	// État pour le décompte
	const [countdown, setCountdown] = useState(5); // Commence à 5 secondes
  
	useEffect(() => {
	  // Si le décompte est terminé, afficher le Board
	  if (countdown === 0) {
		setShowBoard(true);
		return;
	  }
  
	  // Décrémenter le décompte chaque seconde
	  const timerId = setTimeout(() => {
		setCountdown(countdown - 1);
	  }, 1000);
  
	  // Nettoyer le timer
	  return () => clearTimeout(timerId);
  
	}, [countdown]); // Relancer l'effet à chaque changement de countdown
  
	return (
	  <div className='flex flex-col justify-between pl-[122px] pb-[36px] pr-[36px] h-[90vh] bg-red-100 gap-[36px]'>
		{showBoard ? (
		  <Board />
		) : (
		  <div>Le jeu commencera dans {countdown} secondes...</div>
		)}
	  </div>
	);
  }
export default Pong