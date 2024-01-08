import React from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BellRing } from "lucide-react";
import { Music2 } from "lucide-react";

function SecondNavbar() {
	return (
		<div className="flex justify-between align-center pl-[122px] pr-[36px] gap-[50px] h-[10vh]">
			<div className="flex w-[300px] items-center">
				<Input type="text" placeholder="Search Player" />
			</div>

			<div className="flex justify-between gap-[50px]">
				<div className="flex items-center space-x-2">
					<Switch id="double-auth" />
					<Label htmlFor="double-auth">Double Authentification</Label>
				</div>

				<div className="flex items-center gap-[10px]">
					<Button
						variant="secondNavIconStyle"
						size="secondNavIconSize"
					>
						<div className="text-black ">
							<BellRing className="h-[24px] w-[24px]" />
						</div>
					</Button>
					<Button
						variant="secondNavIconStyle"
						size="secondNavIconSize"
					>
						<div className="text-black">
							<Music2 className="h-[24px] w-[24px]" />
						</div>
					</Button>
				</div>
			</div>
		</div>
	);
}

export default SecondNavbar;
