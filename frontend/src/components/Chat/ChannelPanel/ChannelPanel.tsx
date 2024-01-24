import { Button } from "@/components/ui/button";
import { IoAddCircleOutline } from "react-icons/io5";
import React, { useEffect, useState } from "react";
import Modal from "../../Modal";
import TabsChannel from "./TabsChannel/TabsChannel";
import Groups from "./Groups";
import axios from "axios";

type Channel = {
	id: number
	ownerId: number
	name: string
}

function ChannelPanel() {
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

	return (
		<div className="bg-blue-100 h-full w-1/5 rounded-md border">
			<div className="flex justify-between">
				<h1 className="flex overflow-hidden font-bold text-3xl ml-2">Channels</h1>
				<Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
					<IoAddCircleOutline className="h-4 w-4"></IoAddCircleOutline>
				</Button>
				<Modal open={open} onClose={() => setOpen(false)}>
					<TabsChannel onClose={() => setOpen(false)}></TabsChannel>
				</Modal>
			</div>
			<div className="overflow-y-auto">
				<span className="ml-4">Private Messages</span>
			</div>
			<div className="overflow-y-auto">
				<Groups></Groups>
			</div>
		</div>
	);
}

export default ChannelPanel;

/* 

https://react-hook-form.com/form-builder

import React from 'react';
import { useForm } from 'react-hook-form';

export default function App() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = data => console.log(data);
  console.log(errors);
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" placeholder="name" {...register("name", {required: true})} />
      <input type="password" placeholder="password" {...register("password", {required: true})} />
      <input type="checkbox" placeholder="private" {...register("private", {})} />

      <input type="submit" />
    </form>
  );
}

*/
