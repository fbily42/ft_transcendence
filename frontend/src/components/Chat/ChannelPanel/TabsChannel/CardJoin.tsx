import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitHandler, useForm } from 'react-hook-form'
import axios from 'axios'
import { useWebSocket } from '@/context/webSocketContext'
import { Socket } from 'socket.io-client'

interface CardJoinProps {
	onClose: () => void;
}

type FormValues = {
	name: string
	password?: string
}

function CardJoin({onClose}: CardJoinProps) {

	const { register, handleSubmit} = useForm<FormValues>()
	const [ errorMessage, setErrorMessage] = useState<string>('')
	const socket = useWebSocket() as Socket;

	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		try {
			if (data.password === '')
				delete data.password
			const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/chat/join`, data, {
				withCredentials: true,
			});
			socket?.emit('joinChannel', data.name);
			onClose();
		} catch (error) {
			setErrorMessage(error.response.data.message)
			throw error
		}
	}

  return (
	<div>
		<form onSubmit={handleSubmit(onSubmit)}>
			<Card>
			  <CardHeader>
				<CardTitle>Join</CardTitle>
				<CardDescription>
				  Enter channel's informations to join it.
				</CardDescription>
			  </CardHeader>
			  <CardContent className="space-y-2">
				<div className="space-y-1">
				  <Label htmlFor="name">Channel's name</Label>
				  <Input id="name" placeholder="Pinga's Place" {...register("name")}/>
				</div>
				<div className="space-y-1">
				  <Label htmlFor="password">Password</Label>
				  <Input id="password" placeholder="Optionnal" type="password" {...register("password")} />
				</div>
				<div className='text-red-600'>
					{errorMessage}
				</div>
			  </CardContent>
			  <CardFooter>
				<Button>Join Channel</Button>
			  </CardFooter>
			</Card>
		</form>
	</div>
  )
}

export default CardJoin