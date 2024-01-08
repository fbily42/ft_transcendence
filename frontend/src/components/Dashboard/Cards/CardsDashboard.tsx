import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

import {
	Card,
	CardContent,
	// CardDescription,
	// CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface CardsDashboardProps {
	title: string;
	content: number;
}

const CardsDashboard: React.FC<CardsDashboardProps> = ({ title, content }) => {
	return (
		<div>
			<Card className="flex items-center pl-[16px] h-[100%]">
				<div>
					<Avatar>
						<AvatarImage
							className="w-[70px] h-[70px] rounded-full"
							src="https://github.com/shadcn.png"
						/>
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</div>
				<div>
					<CardHeader>
						<CardTitle>{title}</CardTitle>
						{/* <CardDescription>Card Description</CardDescription> */}
					</CardHeader>
					<CardContent>
						<p className="text-[30px]">{content}</p>
					</CardContent>
				</div>
				{/* <CardFooter>
            <p>Card Footer</p>
          </CardFooter> */}
			</Card>
		</div>
	);
};

export default CardsDashboard;
