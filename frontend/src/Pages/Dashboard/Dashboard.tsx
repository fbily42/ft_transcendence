//commande pour avoir d'un coup la config: rfce
import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'

function Dashboard() {
  return (
    <>
    <div >Dashboard</div>
	<Link to="/chat">
    <Button variant="destructive" className='text 3xl bg-black '>Go to chat</Button>
	</Link>
    </>
  )
}

export default Dashboard