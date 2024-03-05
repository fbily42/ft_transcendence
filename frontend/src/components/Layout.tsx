import VerticalNavbar from "./Navbar/AppNavbar";
import { Outlet } from "react-router-dom";
import SecondNavbar from "./Navbar/SecondNavbar";

function Layout(): JSX.Element {
	return (
		<div>
			<VerticalNavbar></VerticalNavbar>
			<SecondNavbar></SecondNavbar>
			<Outlet></Outlet>
		</div>
	);
}

export default Layout;
