import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Dashboard from '../Dashboard/Dashboard'
import Chat from '../Chat/Chat';
import Modal from '@/components/Modal';
import axios from 'axios';
import GameForm from '@/components/Pong/GameForm';
import Board from './Game';


// il y a 2 boutons, un qui permet de chercher un amis, un autre qui permet d'affronter quelqu'un aleatoirement
function Pong() {
  return (
    <div className='flex flex-col justify-between pl-[122px] pb-[36px] pr-[36px] h-[90vh] bg-red-100 gap-[36px]'>
		<Board></Board>
	</div>
  )
  }

export default Pong