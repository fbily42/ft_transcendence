import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CardCreate from './CardCreate'
import CardJoin from './CardJoin'

interface TabsChannelProps {
    onClose: () => void
}

function TabsChannel({ onClose }: TabsChannelProps) {
    return (
        <Tabs defaultValue="create" className="h-full w-full">
            <TabsList className="grid w-full grid-cols-2 bg-customBlue">
                <TabsTrigger value="create">Create</TabsTrigger>
                <TabsTrigger value="join">Join</TabsTrigger>
            </TabsList>
            <TabsContent value="create">
                <CardCreate onClose={onClose}></CardCreate>
            </TabsContent>
            <TabsContent value="join">
                <CardJoin onClose={onClose}></CardJoin>
            </TabsContent>
        </Tabs>
    )
}

export default TabsChannel
