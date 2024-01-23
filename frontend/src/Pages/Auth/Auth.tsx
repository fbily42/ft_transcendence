import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Navigate, useNavigate } from "react-router-dom";
import axios from 'axios';
import Login from '@/components/Auth/Login';
import Modal from '@/components/Chat/ChannelPanel/Modal';


function Auth() : JSX.Element {

	const [isAuth, setIsAuth] = useState<boolean>(false);
	const [open2FA, setOpen2FA] = useState<boolean>(false);

	useEffect(() => {
		async function checkIsAuth() : Promise<void> {
			try {
				const response = await axios.get("http://localhost:3333/auth/isAuth", {
					withCredentials: true
				});
				setIsAuth(true);
			}
			catch (error){
				if (error.response.status === 401
						&& error.response.data.status === "2FA-fail"){
					setOpen2FA(true);
				}
				setIsAuth(false);
			}
		}
		checkIsAuth();
	}, []);

	if (!isAuth){
		return (
			<Login>
				<Modal open={open2FA} onClose={() => setOpen2FA(false)}>
						<form>Form</form>
				</Modal>
			</Login>
		  );
	}
	return (<Navigate to="/"/>);
}

export default Auth