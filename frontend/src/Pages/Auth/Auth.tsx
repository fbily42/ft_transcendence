import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Link, Outlet } from 'react-router-dom'
import { Navigate, useNavigate } from "react-router-dom";
import axios from 'axios';
import Login from '@/components/Auth/Login';
import Modal from '@/components/Modal';
import OtpForm from '@/components/Auth/OtpForm';
import OtpModal from '@/components/TwoFA/OtpModal';


function Auth() : JSX.Element {

	const [isAuth, setIsAuth] = useState<boolean>(false);

	useEffect(() => {
		async function checkIsAuth() : Promise<void> {
			try {
				const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/isAuth`, {
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

	if (isAuth)
		return (<Navigate to="/"/>);
	else {
		return (
			<Login>
				<Outlet></Outlet>
			</Login>
		  );
	}
}

export default Auth