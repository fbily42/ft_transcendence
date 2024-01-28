import OtpModal from "@/components/Auth/OtpModal";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function TwoFA() : JSX.Element {
	let { id } = useParams();
	const navigate = useNavigate();
	const [open2FA, setOpen2FA] = useState<boolean>(true);

	// const onOtpModalClose = () => {

	// 	setOpen2FA(false);
	// 	navigate("/auth");
	// }

	const observer = new PerformanceObserver((list) => {
		list.getEntries().forEach((entry) => {
			console.log(entry)
		})
	});
	
	useEffect(() => {
		const navigationEntries = window.performance.getEntriesByType('navigation');
     	if (navigationEntries.length > 0 && navigationEntries[0].type !== 'navigate') {
			console.log("Page was reloaded");
			navigate("/auth");
    	}
	}, []);

	return (
		<OtpModal open={open2FA} onClose={() => setOpen2FA(false)} redirect={""} verify={false} id={id}></OtpModal>
	)

}

export default TwoFA;