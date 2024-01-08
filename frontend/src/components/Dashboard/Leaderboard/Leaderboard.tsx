// ? Table
// import {
// 	Table,
// 	TableBody,
// 	TableCaption,
// 	TableCell,
// 	TableFooter,
// 	TableHead,
// 	TableHeader,
// 	TableRow,
// } from "@/components/ui/table";

// const invoices = [
// 	{
// 		rank: "INV001",
// 		player: "Paid",
// 		score: "$250.00",
// 	},
// 	{
// 		rank: "INV002",
// 		player: "Pending",
// 		score: "$150.00",
// 	},
// 	{
// 		rank: "INV003",
// 		player: "Unpaid",
// 		score: "$350.00",
// 	},
// 	{
// 		rank: "INV004",
// 		player: "Paid",
// 		score: "$450.00",
// 	},
// ];

// function LeaderBoard() {
// 	return (
// 		<Table>
// 			<TableHeader>
// 				<TableRow>
// 					<TableHead className="w-[100px]">Rank</TableHead>
// 					<TableHead>Player</TableHead>
// 					<TableHead className="text-right">Score</TableHead>
// 				</TableRow>
// 			</TableHeader>
// 			<TableBody>
// 				{invoices.map((invoice) => (
// 					<TableRow key={invoice.rank}>
// 						<TableCell className="font-medium">
// 							{invoice.rank}
// 						</TableCell>
// 						<TableCell>{invoice.player}</TableCell>
// 						<TableCell className="text-right">
// 							{invoice.score}
// 						</TableCell>
// 					</TableRow>
// 				))}
// 			</TableBody>
// 		</Table>
// 	);
// }

// export default LeaderBoard;

// ? Data Table Brute
// import * as React from "react";
// import {
// 	ColumnDef,
// 	ColumnFiltersState,
// 	SortingState,
// 	VisibilityState,
// 	flexRender,
// 	getCoreRowModel,
// 	getFilteredRowModel,
// 	getPaginationRowModel,
// 	getSortedRowModel,
// 	useReactTable,
// } from "@tanstack/react-table";
// import { ArrowUpDown } from "lucide-react";

// import { Button } from "@/components/ui/button";
// // import { Checkbox } from "@/components/ui/checkbox"
// // import {
// //   DropdownMenu,
// //   DropdownMenuCheckboxItem,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuLabel,
// //   DropdownMenuSeparator,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu"
// import { Input } from "@/components/ui/input";
// import {
// 	Table,
// 	TableBody,
// 	TableCell,
// 	TableHead,
// 	TableHeader,
// 	TableRow,
// } from "@/components/ui/table";

// const data: Payment[] = [
// 	{
// 		id: "m5gr84i9",
// 		score: 316,
// 		rank: "success",
// 		player: "ken99@yahoo.com",
// 	},
// 	{
// 		id: "3u1reuv4",
// 		score: 242,
// 		rank: "success",
// 		player: "Abe45@gmail.com",
// 	},
// 	{
// 		id: "derv1ws0",
// 		score: 837,
// 		rank: "processing",
// 		player: "Monserrat44@gmail.com",
// 	},
// 	{
// 		id: "5kma53ae",
// 		score: 874,
// 		rank: "success",
// 		player: "Silas22@gmail.com",
// 	},
// 	{
// 		id: "bhqecj4p",
// 		score: 721,
// 		rank: "failed",
// 		player: "carmella@hotmail.com",
// 	},
// ];

// export type Payment = {
// 	id: string;
// 	score: number;
// 	rank: "pending" | "processing" | "success" | "failed";
// 	player: string;
// };

// export const columns: ColumnDef<Payment>[] = [
// 	{
// 		accessorKey: "rank",
// 		header: "Rank",
// 		cell: ({ row }) => (
// 			<div className="capitalize">{row.getValue("rank")}</div>
// 		),
// 	},
// 	{
// 		accessorKey: "player",
// 		header: ({ column }) => {
// 			return (
// 				<Button
// 					variant="ghost"
// 					onClick={() =>
// 						column.toggleSorting(column.getIsSorted() === "asc")
// 					}
// 				>
// 					Player
// 					<ArrowUpDown className="ml-2 h-4 w-4" />
// 				</Button>
// 			);
// 		},
// 		cell: ({ row }) => (
// 			<div className="lowercase">{row.getValue("player")}</div>
// 		),
// 	},
// 	{
// 		accessorKey: "score",
// 		header: () => <div className="text-right">Score</div>,
// 		cell: ({ row }) => {
// 			const score = parseFloat(row.getValue("score"));

// 			// Format the score as a dollar score
// 			const formatted = new Intl.NumberFormat("en-US", {
// 				style: "currency",
// 				currency: "USD",
// 			}).format(score);

// 			return <div className="text-right font-medium">{formatted}</div>;
// 		},
// 	},
// 	{
// 		id: "actions",
// 		enableHiding: false,
// 	},
// ];

// function LeaderBoard() {
// 	const [sorting, setSorting] = React.useState<SortingState>([]);
// 	const [columnFilters, setColumnFilters] =
// 		React.useState<ColumnFiltersState>([]);
// 	const [columnVisibility, setColumnVisibility] =
// 		React.useState<VisibilityState>({});
// 	const [rowSelection, setRowSelection] = React.useState({});

// 	const table = useReactTable({
// 		data,
// 		columns,
// 		onSortingChange: setSorting,
// 		onColumnFiltersChange: setColumnFilters,
// 		getCoreRowModel: getCoreRowModel(),
// 		getPaginationRowModel: getPaginationRowModel(),
// 		getSortedRowModel: getSortedRowModel(),
// 		getFilteredRowModel: getFilteredRowModel(),
// 		onColumnVisibilityChange: setColumnVisibility,
// 		onRowSelectionChange: setRowSelection,
// 		state: {
// 			sorting,
// 			columnFilters,
// 			columnVisibility,
// 			rowSelection,
// 		},
// 	});

// 	return (
// 		<div className="w-full">
// 			<div className="rounded-md border">
// 				<Table>
// 					<TableHeader>
// 						{table.getHeaderGroups().map((headerGroup) => (
// 							<TableRow key={headerGroup.id}>
// 								{headerGroup.headers.map((header) => {
// 									return (
// 										<TableHead key={header.id}>
// 											{header.isPlaceholder
// 												? null
// 												: flexRender(
// 														header.column.columnDef
// 															.header,
// 														header.getContext()
// 												  )}
// 										</TableHead>
// 									);
// 								})}
// 							</TableRow>
// 						))}
// 					</TableHeader>
// 					<TableBody>
// 						{table.getRowModel().rows?.length ? (
// 							table.getRowModel().rows.map((row) => (
// 								<TableRow
// 									key={row.id}
// 									data-state={
// 										row.getIsSelected() && "selected"
// 									}
// 								>
// 									{row.getVisibleCells().map((cell) => (
// 										<TableCell key={cell.id}>
// 											{flexRender(
// 												cell.column.columnDef.cell,
// 												cell.getContext()
// 											)}
// 										</TableCell>
// 									))}
// 								</TableRow>
// 							))
// 						) : (
// 							<TableRow>
// 								<TableCell
// 									colSpan={columns.length}
// 									className="h-24 text-center"
// 								>
// 									No results.
// 								</TableCell>
// 							</TableRow>
// 						)}
// 					</TableBody>
// 				</Table>
// 			</div>
// 			<div className="flex items-center justify-end space-x-2 py-4">
// 				<div className="flex-1 text-sm text-muted-foreground">
// 					{table.getFilteredSelectedRowModel().rows.length} of{" "}
// 					{table.getFilteredRowModel().rows.length} row(s) selected.
// 				</div>
// 				<div className="space-x-2">
// 					<Button
// 						variant="outline"
// 						size="sm"
// 						onClick={() => table.previousPage()}
// 						disabled={!table.getCanPreviousPage()}
// 					>
// 						Previous
// 					</Button>
// 					<Button
// 						variant="outline"
// 						size="sm"
// 						onClick={() => table.nextPage()}
// 						disabled={!table.getCanNextPage()}
// 					>
// 						Next
// 					</Button>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

// export default LeaderBoard;

// ??????????????????????????????????????????????????

import React, { useState, useEffect } from "react";
import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Payment[]> {
	// Fetch data from your API here.
	return [
		{
			id: "728ed52f",
			score: 100,
			rank: "pending",
			player: "m@example.com",
		},
		{
			id: "728ed52f",
			score: 100,
			rank: "pending",
			player: "m@example.com",
		},
		{
			id: "728ed52f",
			score: 100,
			rank: "pending",
			player: "m@example.com",
		},
		{
			id: "728ed52f",
			score: 100,
			rank: "pending",
			player: "m@example.com",
		},
		{
			id: "728ed52f",
			score: 100,
			rank: "pending",
			player: "m@example.com",
		},
		{
			id: "728ed52f",
			score: 100,
			rank: "pending",
			player: "m@example.com",
		},
		{
			id: "728ed52f",
			score: 100,
			rank: "pending",
			player: "m@example.com",
		},
		{
			id: "728ed52f",
			score: 100,
			rank: "pending",
			player: "m@example.com",
		},
		{
			id: "728ed52f",
			score: 100,
			rank: "pending",
			player: "m@example.com",
		},
		{
			id: "728ed52f",
			score: 100,
			rank: "pending",
			player: "m@example.com",
		},
		{
			id: "728ed52f",
			score: 100,
			rank: "pending",
			player: "m@example.com",
		},
	];
}

export default function LeaderBoard() {
	const [data, setData] = useState<Payment[]>([]);

	useEffect(() => {
		async function fetchData() {
			const result = await getData();
			setData(result);
		}
		fetchData();
	}, []);

	return (
		<div className="h-[100%]">
			{data.length > 0 && <DataTable columns={columns} data={data} />}
		</div>
	);
}
