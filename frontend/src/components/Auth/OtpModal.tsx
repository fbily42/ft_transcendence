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
	const [token, setToken] = useState<string>('      ');
	const [isTokValid, setIsTokValid] = useState<boolean>(true);

	const onSubmit = async (e) => {
		e.preventDefault();
		console.log("verify false");
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
					headers: {
						'Content-Type': 'application/json',
					}
				}
			);
			if (response.status === 202)
				alert("Valid token");
		}
		catch (error){
			console.log("error")
			console.log(error);
			if (error.status === 401){
				setIsTokValid(false);
				alert("Invalid token");
			}
		}
	};

	return (
	<Modal open={open} onClose={onClose}>
		<p className="mb-4 text-base text-center font-bold">Verify code</p>
		<OtpForm value={token} onChange={setToken} onSubmit={onSubmit}></OtpForm>
		{isTokValid ? null : <p className="text-sm">Token is invalid</p>}
	</Modal>
	);
}

export default OtpModal;