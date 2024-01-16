import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState  } from "react";
import axios from 'axios';


function ProtectedRoute() : JSX.Element {

	const [auth, setAuth] = useState<Boolean>(false);

	useEffect(() => {
		async function checkIsAuth() {
			try {
				const response = await axios.get("http://localhost:3333/auth/isAuth", {
					withCredentials: true
				});

				console.log("Response", response);
				setAuth(true);
				console.log("Authentified 1 = ", auth);
			}
			catch (error){
				console.log("Error", error);
				setAuth(false);
				console.log("Authentified 2 = ", auth);
			}
		}
		checkIsAuth();
	}, []);

	useEffect(() => {
 		console.log("auth2", auth);
	}, [auth]);

	console.log("auth", auth);
	return (
		auth ? <Outlet/> : <Navigate to="/auth"/>
	);
}

export default ProtectedRoute;