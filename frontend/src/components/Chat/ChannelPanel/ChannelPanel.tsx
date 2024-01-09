import { Button } from '@/components/ui/button'
import { IoAddCircleOutline } from "react-icons/io5"

import React from 'react'

function ChannelPanel() {
  return (
	<div className="bg-blue-100 h-full w-1/5 rounded-md border">
		<div className='flex justify-between'>
			<span className='font-bold text-3xl ml-2'>Channels</span>
			<Button variant="ghost" size='sm'>
				<IoAddCircleOutline className="h-4 w-4"></IoAddCircleOutline>
			</Button>
		</div>
		<div className='overflow-y-auto'>
			<span className='ml-4'>Private Messages</span>
		</div>
		<div className='overflow-y-auto'>
			<span className='ml-4'>Groups</span>
		</div>
	</div>
  )
}

export default ChannelPanel