import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Navigate } from "react-router-dom";
import axios from 'axios';

function Auth() : JSX.Element {

	const [isAuth, setIsAuth] = useState<boolean>(false);

	useEffect(() => {
		async function checkIsAuth() : Promise<void> {
			try {
				const response = await axios.get("http://localhost:3333/auth/isAuth", {
					withCredentials: true
				});
				setIsAuth(true);
			}
			catch (error){
				setIsAuth(false);
			}
		}
		checkIsAuth();
	}, []);

	if (!isAuth){
		return (
			<div className='w-full h-[100vh] flex justify-center items-center'>
				<Link to={import.meta.env.VITE_REDIRECT_URI}>
					<Button variant='destructive'>Login 42</Button>
				</Link>
			</div>
		  );
	}
	return (<Navigate to="/"/>);
}

export default Auth