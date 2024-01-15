import { Button } from "@/components/ui/button";
import { IoAddCircleOutline } from "react-icons/io5";

import React, { useState } from "react";
import Modal from "./Modal";

function ChannelPanel() {
	const [open, setOpen] = useState<boolean>(false)

	return (
		<div className="bg-blue-100 h-full w-1/5 rounded-md border">
			<div className="flex justify-between">
				<span className="font-bold text-3xl ml-2">Channels</span>
				<Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
					<IoAddCircleOutline className="h-4 w-4"></IoAddCircleOutline>
				</Button>
				<Modal open={open} onClose={() => setOpen(false)}>
					<div className="flex flex-col gap-4">
						<p>Inserer ici le formulaire</p>
					</div>
					<Button onClick={() => setOpen(false)}>Submit</Button>
				</Modal>
			</div>
			<div className="overflow-y-auto">
				<span className="ml-4">Private Messages</span>
			</div>
			<div className="overflow-y-auto">
				<span className="ml-4">Groups</span>
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
