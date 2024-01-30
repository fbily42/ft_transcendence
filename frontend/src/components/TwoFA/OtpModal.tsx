import { useState } from "react";
import Modal from "../Modal";
import OtpForm from "./OtpForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type OtpModalProps = {
	open: boolean,
	uuid: string,
	onClose: () => void,
	redirect: string,
	verify: boolean,
}

type TokenData = {
	token: string
	uuid: string
}

const OtpModal: React.FC<OtpModalProps> = ({open, uuid, onClose, redirect, verify = false}) => {
	const navigate = useNavigate();
	const [token, setToken] = useState<string>('      ');
	const [isTokValid, setIsTokValid] = useState<boolean>(true);

	const onSubmit = async (e) => {

		e.preventDefault();
		try {
			const data: TokenData = {
				token: token,
				uuid: uuid,
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
			if (response.status === 202)
				navigate('/');
		}
		catch (error){
			if (error.response.status === 401)
				setIsTokValid(false);
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