import { useContext, useEffect, useState } from "react";
import Modal from "../Modal";
import OtpForm from "../TwoFA/OtpForm";
import QRCode from "react-qr-code";
import axios from "axios";
import { toast } from "sonner";
import { TwoFAContext } from "@/context/twoFAEnableContext";

type SetUp2FAModalProps = {
	open: boolean,
	onClose: () => void,
}

const SetUp2FAModal: React.FC<SetUp2FAModalProps> = ({open, onClose}) => {

	//set 3 states
		// secret key : string
		// set otp url : string
		// set token : string
		// set isTokValid : string
	const [key, setKey] = useState<string>('');
	const [otpUrl, setOtpUrl] = useState<string>('');
	const [token, setToken] = useState<string>('      ');
	const [isTokValid, setIsTokValid] = useState<string>('');

	const {enableTwoFA, setTwoFAVerified} = useContext(TwoFAContext);
	
	// use effect 
		// at mounted : 
			// post /generate and retrieve key and otp url
			// sets key and otpUrl
	useEffect(() =>  {
		async function generateOTPkey() {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_BACKEND_URL}/auth/otp/generate`,
					{withCredentials: true}
				)
				setKey(response.data.otp_secret);
				setOtpUrl(response.data.otp_url);
			}
			catch (error) {
				onClose();
			}
		}

		if (open) {
			generateOTPkey();
			setToken('      ');
		}

	}, [open]);

	// onSubmit function 
		// posts token to /verify 
		// sets up IsTokenValid
	
	type TokenData = {
		token: string
	}

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

		e.preventDefault();
		try {
			const data: TokenData = {
				token: token,
			}

			const response = await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/auth/otp/verify`,
				data,
				{
					withCredentials: true,
					headers: {
						'Content-Type': 'application/json',
					}
				}
			);
			if (response.status === 202) {
				setTwoFAVerified();
				enableTwoFA();
				onClose();
				toast("Two factor authentication has successfully been verified and enabled.");
			}
			//Open a success notif/message box
			//Toggle the switch
		}
		catch (error){
			if (error.response.status === 401)
				setIsTokValid('Token is not valid');
			else if (error.response.status === 500)
				setIsTokValid('Internal server error');
		}
	}; 
 
	return (
		<div className="w-full h-full">
			<Modal open={open} onClose={onClose}>
				<div className="flex flex-col gap-[20px] p-[24px] border-10">
					<div>
						<p className="text-lg font-bold">
							Two-Factor Authentication (2FA)
						</p>
					</div>
					<div>
						<ol className="text-sm font-light">
							<li>
								<p>1. Install the authenticator app of your choice (Google Authenticator, Authy, Chrome Authenticator...)</p>
							</li>
							<li>
								<p>2. In the authenticator app, select '+' icon</p>
							</li>
							<li>
								<p>3. Select 'Scan a barcode (or QR code)' and use the phone's camera to scan the QR code below</p>
							</li>
						</ol>
					</div>
					<div>
						<hr></hr>
					</div>
					<div>
						<p className="text-md font-bold">
							Scan QR code
						</p>
					</div>
					<div className="flex justify-center items-center">
						<QRCode
							value={otpUrl}
							size={172}
						>
						</QRCode>
					</div>
					<div>
						<div>
							<p className="capitalize font-bold text-sm text-center">
								Or enter code manually into your app
							</p>
							<p className="text-sm text-center">
								SecretKey: {key}
							</p>
						</div>
					</div>
					<div>
						<hr></hr>
					</div>
					<div>
						<p className="text-md font-bold">
							Verify code
						</p>
					</div>
					<div>
						<OtpForm
							value={token}
							onChange={setToken}
							onSubmit={onSubmit}
							onClose={onClose}
							isTokenValid={isTokValid}
							/>
					</div>
				</div>
			</Modal>
		</div>
	);
}

export default SetUp2FAModal;