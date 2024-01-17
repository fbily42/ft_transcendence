import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function CardJoin() {
  return (
	<div>
		<Card>
		  <CardHeader>
			<CardTitle>Join</CardTitle>
			<CardDescription>
			  Enter channel's informations to join it.
			</CardDescription>
		  </CardHeader>
		  <CardContent className="space-y-2">
			<div className="space-y-1">
			  <Label htmlFor="name">Channel's name</Label>
			  <Input id="name"/>
			</div>
			<div className="space-y-1">
			  <Label htmlFor="password">Password</Label>
			  <Input id="password" type="password" />
			</div>
		  </CardContent>
		  <CardFooter>
			<Button>Join Channel</Button>
		  </CardFooter>
		</Card>
	</div>
  )
}

export default CardJoin