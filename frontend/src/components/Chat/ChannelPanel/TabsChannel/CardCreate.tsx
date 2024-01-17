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
import axios from 'axios'
import { useForm, SubmitHandler } from 'react-hook-form'

type FormValues = {
	name: string
	password?: string
	private: boolean
}

interface CardCreateProps {
	onClose: () => void;
}

// TODO : Check if error exists + Find a way to clear error when modal closed

function CardCreate({onClose}: CardCreateProps) {

	const { register, handleSubmit} = useForm<FormValues>()
	const [ errorMessage, setErrorMessage ] = useState<string>('')

	const onSubmit: SubmitHandler<FormValues> = async (data) => {
			try {
				if (data.password === '')
					delete data.password;
				const response = await axios.post("http://localhost:3333/chat/add", data, {
					withCredentials: true,
				});
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
				<CardTitle>Create</CardTitle>
				<CardDescription>
				  Enter channel's name and set a password if you need it.
				</CardDescription>
			  </CardHeader>
			  <CardContent className="space-y-2">
				<div className="space-y-1">
				  <Label htmlFor="name">Channel's Name</Label>
				  <Input id="name" placeholder="Pingu's Family" {...register("name")} />
				</div>
				<div className="space-y-1">
				  <Label htmlFor="password">Password</Label>
				  <Input id="password" placeholder="Optionnal" type="password" {...register("password")} />
				</div>
				<div className="flex items-center space-x-2 space-y-1">
					<input type="checkbox" id="private" {...register("private", {})} />
					<Label htmlFor="private"
						className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Invitation only
					</Label>
				</div>
				<div className='text-red-600'>
					{errorMessage}
				</div>
			  </CardContent>
			  <CardFooter>
				<Button type="submit">Create Channel</Button>
			  </CardFooter>
			</Card>
		</form>
	</div>
  )
}

export default CardCreate