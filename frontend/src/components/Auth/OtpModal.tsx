import { useState } from "react";
import Modal from "../Modal";
import OtpForm from "./OtpForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type OtpModalProps = {
	open: boolean,
	id: number,
	onClose: () => void,
	redirect: string,
	verify: boolean,
}

type TokenData = {
	token: string
	id: number
}

const OtpModal: React.FC<OtpModalProps> = ({open, id, onClose, redirect, verify = false}) => {
	const navigate = useNavigate();
	const [token, setToken] = useState<string>('      ');
	const [isTokValid, setIsTokValid] = useState<boolean>(true);

	const onSubmit = async (e) => {

		e.preventDefault();
		try {
			const data: TokenData = {
				token: token,
				id: id,
			}
			console.log(data);
			const response = await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/auth/otp/validate`,
				data,
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					}
				}
			);
			console.log("Valid token");
			if (response.status === 202)
			{
				console.log("status 202");
				onClose();
				navigate('/');
			}
		}
		catch (error){
			console.log("error")
			console.log(error);
			if (error.response.status === 401){
				setIsTokValid(false);
				console.log("error 401, isTokenValid : ", isTokValid);
			}
		}
	};

	return (
	<Modal open={open} onClose={onClose}>
		<div className="grid gap-y-6">
			<div>
				<p className="text-base text-center font-bold">Verify code</p>
			</div>
			<div>
				<OtpForm value={token} onChange={setToken} onSubmit={onSubmit} isTokenValid={isTokValid}></OtpForm>
			</div>
		</div>
	</Modal>
	);
}

export default OtpModal;