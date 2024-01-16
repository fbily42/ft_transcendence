import { Outlet, useNavigate,Navigate } from "react-router-dom";
import { useEffect, useState  } from "react";
import axios from 'axios';


function ProtectedRoute() : JSX.Element {
	const navigate = useNavigate()
	const [auth, setAuth] = useState<boolean>(false);

	useEffect(() => {
		async function checkIsAuth() {
			try {
				const response = await axios.get("http://localhost:3333/auth/isAuth", {
					withCredentials: true
				});
				setAuth(true);
			}
			catch (error){
				console.log("Error", error);
				setAuth(() => {
					return false;
				});
				navigate('/auth');
			}
		}
		checkIsAuth();
	}, []);

	console.log("auth", auth);
	// return (
		// auth ? <Outlet/> : <Navigate to="/auth"/>
	// );
	if (auth){
		return <Outlet></Outlet>
	}
	return <div></div>
}

export default ProtectedRoute;