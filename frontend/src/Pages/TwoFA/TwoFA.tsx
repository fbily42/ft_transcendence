import OtpModal from "@/components/Auth/OtpModal";
import { useState } from "react";
import { useParams } from "react-router-dom";

function TwoFA() : JSX.Element {
	let { id } = useParams();
	const [open2FA, setOpen2FA] = useState<boolean>(true);

	return (
		<OtpModal open={open2FA} onClose={() => setOpen2FA(false)} redirect={""} verify={false} id={id}></OtpModal>
	)

}

export default TwoFA;