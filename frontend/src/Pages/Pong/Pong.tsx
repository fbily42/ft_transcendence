import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Dashboard from '../Dashboard/Dashboard'
import Chat from '../Chat/Chat';
import Modal from '@/components/Modal';
import axios from 'axios';
import GameForm from '@/components/Pong/GameForm';
import Board from './Game';
import Basic from './BasicGame';


// faire un decompte en blur ou on voit le jeu en arriere plan, prevoir le cas de la reconnection pour ne pas declencher le decompte dans ce cas la 
// solution possible faire le decompte ici mais envoyer la fonction qui change le useState dans la fonction Board
function Pong() {
	// État pour déterminer si le Board doit être affiché
	
	return (
	  <div className='flex flex-col justify-between pl-[122px] pb-[36px] pr-[36px] h-[90vh] bg-red-100 gap-[36px]'>
		
		  <Board />
		  {/* <Basic /> */}
	  </div>
	);
  }
export default Pong