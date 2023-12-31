import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Dashboard";
import AppNavbar from "./components/AppNavbar";
import Pong from "./Pages/Pong/Pong";
import Chat from "./Pages/Chat/Chat";
// import { Button } from "@/components/ui/button"

function App() {
	return (
		<>
			<Routes>
				<Route element={<AppNavbar></AppNavbar>}>
					<Route index path="/" element={<Dashboard />}></Route>
					<Route index path="/pong" element={<Pong />}></Route>
					<Route index path="/chat" element={<Chat />}></Route>
				</Route>
			</Routes>
		</>
	);
}

export default App;
