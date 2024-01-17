import { Outlet, useNavigate,Navigate } from "react-router-dom";
import { useEffect, useState  } from "react";
import axios from 'axios';


function ProtectedRoute() : JSX.Element {
	const navigate = useNavigate()
	const [auth, setAuth] = useState<boolean>(false);

	useEffect(() => {
		async function checkIsAuth() : Promise<void> {
			try {
				const response = await axios.get("http://localhost:3333/auth/isAuth", {
					withCredentials: true
				});
				setAuth(true);
			}
			catch (error){
				setAuth(false);
				navigate('/auth');
			}
		}
		checkIsAuth();
	}, []);

	if (auth){
		return (<Outlet></Outlet>);
	}
	return (<div></div>);
}

export default ProtectedRoute;