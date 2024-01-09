import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Link, LinkProps } from 'react-router-dom'

function Auth() {
  return (
	<div className='w-full h-[100vh] flex justify-center items-center'>
		<Link to={import.meta.env.VITE_REDIRECT_URI}>
			<Button variant='destructive'>Login 42</Button>
		</Link>
	</div>
  )
}

export default Auth