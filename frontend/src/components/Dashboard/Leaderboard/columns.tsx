import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
	id: string;
	score: number;
	rank: "pending" | "processing" | "success" | "failed";
	player: string;
};

export const columns: ColumnDef<Payment>[] = [
	{
		accessorKey: "rank",
		header: "Rank",
	},
	{
		accessorKey: "player",
		header: "Player",
		cell: ({ row }) => {
			const amount: string = row.getValue("player");

			return (
				<div className="text-right font-medium flex items-center gap-[20px]">
					<Avatar>
						<AvatarImage
							className="rounded-full w-[40px] h-[40px] rounded-full"
							src="https://github.com/shadcn.png"
						/>
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<div className="text-right font-medium">{amount}</div>
				</div>
			);
		},
	},
	{
		accessorKey: "score",
		header: () => <div className="text-right">Score</div>,
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("score"));
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
			}).format(amount);

			return <div className="text-right font-medium">{formatted}</div>;
		},
	},
];
