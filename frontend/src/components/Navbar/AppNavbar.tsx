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
	const [active, setActive] = useState(1);

	const handleNavTabs = (btnId: number) => {
		if (active !== btnId) setActive(btnId);
	};

	return (
		<nav className="fixed bg-white shadow-drop h-screen w-[86px] flex flex-col justify-center pl-[18px] py-[36px]">
			<div className="flex flex-col justify-between h-full">
				<Link
					to="/"
					className="text-black font-bold text-lg"
					onClick={() => handleNavTabs(1)}
				>
					Pingu
				</Link>
				<div className="flex flex-col items-start gap-[33px]">
					<Link to="/" className="text-black">
						<Button
							variant={
								active === 1 ? "tabBtnActive" : "tabBtnDefault"
							}
							size="openedTabSize"
							onClick={() => handleNavTabs(1)}
						>
							<div
								className={`pr-[20px] ${
									active === 1 ? "text-white" : "text-black"
								}`}
							>
								<Home className="h-[24px] w-[24px]" />
							</div>
						</Button>
					</Link>
					<Link to="/pong" className="text-black">
						<Button
							variant={
								active === 2
									? "gameBtnActive"
									: "gameBtnDefault"
							}
							size="icon"
							onClick={() => handleNavTabs(2)}
						>
							<div
								className={`${
									active === 2 ? "text-white" : "text-black"
								}`}
							>
								<Gamepad2 className="h-[24px] w-[24px]" />
							</div>
						</Button>
					</Link>
					<Link to="/chat" className="text-black">
						<Button
							variant={
								active === 3 ? "tabBtnActive" : "tabBtnDefault"
							}
							size="openedTabSize"
							onClick={() => handleNavTabs(3)}
						>
							<div
								className={`pr-[20px] ${
									active === 3 ? "text-white" : "text-black"
								}`}
							>
								<MessageCircle className="h-[24px] w-[24px]" />
							</div>
						</Button>
					</Link>
				</div>
				<div className="flex flex-col items-start gap-[13px]">
					<Link to="/profile" className="text-black">
						<Button
							variant={
								active === 4 ? "tabBtnActive" : "tabBtnDefault"
							}
							size="openedTabSize"
							onClick={() => handleNavTabs(4)}
						>
							<div
								className={`pr-[20px] ${
									active === 4 ? "text-white" : "text-black"
								}`}
							>
								<CircleUserRound className="h-[24px] w-[24px]" />
							</div>
						</Button>
					</Link>

					<Link to="/auth" className="text-black">
						<Button
							variant={
								active === 5 ? "tabBtnActive" : "tabBtnDefault"
							}
							size="openedTabSize"
							onClick={() => handleNavTabs(5)}
						>
							<div
								className={`pr-[20px] ${
									active === 5 ? "text-white" : "text-black"
								}`}
							>
								<LogOut className="h-[24px] w-[24px]" />
							</div>
						</Button>
					</Link>
				</div>
			</div>
		</nav>
	);
};

export default VerticalNavbar;
