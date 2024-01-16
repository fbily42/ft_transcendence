import React from 'react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import CardCreate from './CardCreate'
import CardJoin from './CardJoin'

function TabsChannel() {
	
	return (
		<Tabs defaultValue="create" className="w-[400px]">
		  <TabsList className="grid w-full grid-cols-2">
			<TabsTrigger value="create">Create</TabsTrigger>
			<TabsTrigger value="join">Join</TabsTrigger>
		  </TabsList>
		  <TabsContent value="create">
			<CardCreate></CardCreate>
		  </TabsContent>
		  <TabsContent value="join">
			<CardJoin></CardJoin>
		  </TabsContent>
		</Tabs>
	  )
	}

export default TabsChannel