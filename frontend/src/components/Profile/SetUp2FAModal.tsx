import Modal from "../Modal";
import OtpForm from "../TwoFA/OtpForm";
import QRCode from "react-qr-code";

type SetUp2FAModalProps = {
	open: boolean,
	onClose: () => void,
}

const SetUp2FAModal: React.FC<SetUp2FAModalProps> = ({open, onClose}) => {

	//set 3 states
		// secret key : string
		// set otp url : string
		// set token : string
	const key = "";
	const otpUrl = "https://www.youtube.com/watch?v=xvFZjo5PgG0"
	
	// use effect 
		// at mounted : 
			// post /generate and retrieve key and otp url
			// updates states
		// at unmouted :
			// on close
 
	return (
		<div className="w-full h-full">
			<Modal open={open} onClose={onClose}>
				<div className="flex flex-col gap-[20px] p-[24px] border-10">
					<div className="bg-sky-500">
						<p className="text-md font-bold">
							Two-Factor Authentication (2FA)
						</p>
					</div>
					<div className="bg-sky-500/80">
						<ol className="text-sm">
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
					<div className="bg-sky-500/70">
						<p className="text-md font-bold">
							Scan QR code
						</p>
					</div>
					<div className="bg-sky-500/50 flex justify-center items-center">
						<QRCode
							value={otpUrl}
							size={172}
						>
						</QRCode>
					</div>
					<div className="bg-sky-500/40">
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
					<div className="bg-sky-500/25">
						<p className="text-md font-bold">
							Verify code
						</p>
					</div>
					<div className="bg-sky-500/10">
						<OtpForm
							value={''}
							onChange={() => {}}
							onSubmit={() => {}}
							isTokenValid={true}
							/>
					</div>
				</div>
			</Modal>
		</div>
	);
}

export default SetUp2FAModal;