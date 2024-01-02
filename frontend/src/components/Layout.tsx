import AppNavbar from "./Navbar/AppNavbar";
import { Outlet } from "react-router-dom";
import SecondNavbar from "./Navbar/SecondNavbar";

function Layout() {
	return (
		<div>
			<AppNavbar></AppNavbar>
			<SecondNavbar></SecondNavbar>
			<Outlet></Outlet>
		</div>
	);
}

export default Layout;
