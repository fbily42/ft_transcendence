import React from "react";
import { useState } from "react";

// Icons
import { Gamepad2 } from "lucide-react";
import { Home } from "lucide-react";
import { MessageCircle } from "lucide-react";
import { LogOut } from "lucide-react";
import { CircleUserRound } from "lucide-react";

// Buttons
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const VerticalNavbar: React.FC = () => {
	const [dashboardClicked, setDashboardClicked] = useState(true);
	const [chatClicked, setChatClicked] = useState(false);
	const [gameClicked, setGameClicked] = useState(false);

	const handleDashboardClick = () => {
		if (
			!dashboardClicked ||
			(dashboardClicked && chatClicked && gameClicked)
		) {
			setDashboardClicked(!dashboardClicked);
			if (chatClicked) {
				setChatClicked(false);
			}
			if (gameClicked) {
				setGameClicked(false);
			}
		}
	};

	const handleGameClicked = () => {
		if (!gameClicked || (gameClicked && dashboardClicked && chatClicked)) {
			setGameClicked(!gameClicked);
			if (chatClicked) {
				setChatClicked(false);
			}
			if (dashboardClicked) {
				setDashboardClicked(false);
			}
		}
	};

	const handleChatClick = () => {
		if (!chatClicked || (chatClicked && dashboardClicked && gameClicked)) {
			setChatClicked(!chatClicked);
			if (dashboardClicked) {
				setDashboardClicked(false);
			}
			if (gameClicked) {
				setGameClicked(false);
			}
		}
	};

	const handleLogoClick = () => {
		setDashboardClicked(true);
		setChatClicked(false);
		setGameClicked(false);
	};

	return (
		<nav className="bg-white shadow-drop h-screen w-[86px] flex flex-col justify-center pl-[18px] py-[36px]">
			<div className="flex flex-col justify-between h-full">
				<Link
					to="/"
					className="text-black font-bold text-lg"
					onClick={handleLogoClick}
				>
					Pingu
				</Link>
				<div className="flex flex-col items-start gap-[33px]">
					<Link to="/" className="text-black">
						<Button
							variant={
								dashboardClicked
									? "tabBtnActive"
									: "tabBtnDefault"
							}
							size="openedTabSize"
							onClick={handleDashboardClick}
						>
							<div
								className={`pr-[20px] ${
									dashboardClicked
										? "text-white"
										: "text-black"
								}`}
							>
								<Home className="h-[24px] w-[24px]" />
							</div>
						</Button>
					</Link>
					<Link to="/pong" className="text-black">
						<Button
							variant={
								gameClicked ? "gameBtnActive" : "gameBtnDefault"
							}
							size="icon"
							onClick={handleGameClicked}
						>
							<div
								className={`${
									gameClicked ? "text-white" : "text-black"
								}`}
							>
								<Gamepad2 className="h-[24px] w-[24px]" />
							</div>
						</Button>
					</Link>
					<Link to="/chat" className="text-black">
						<Button
							variant={
								chatClicked ? "tabBtnActive" : "tabBtnDefault"
							}
							size="openedTabSize"
							onClick={handleChatClick}
						>
							<div
								className={`pr-[20px] ${
									chatClicked ? "text-white" : "text-black"
								}`}
							>
								<MessageCircle className="h-[24px] w-[24px]" />
							</div>
						</Button>
					</Link>
				</div>
				<div className="flex flex-col items-start">
					<a href="#profile" className="text-black">
						<CircleUserRound />
					</a>
					<a href="#logout" className="text-black">
						<LogOut />
					</a>
				</div>
			</div>
		</nav>
	);
};

export default VerticalNavbar;
