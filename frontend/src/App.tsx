import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Pong from "./Pages/Pong/Pong";
import Chat from "./Pages/Chat/Chat";
import Profile from "./Pages/Profile/Profile";
import Layout from "./components/Layout";
// import { Button } from "@/components/ui/button"

function App() {
	return (
		<>
			<Routes>
				<Route element={<Layout />}>
					<Route index path="/" element={<Dashboard />}></Route>
					<Route path="/pong" element={<Pong />}></Route>
					<Route path="/chat" element={<Chat />}></Route>
					<Route path="/profile" element={<Profile />}></Route>
				</Route>
			</Routes>
		</>
	);
}

export default App;
