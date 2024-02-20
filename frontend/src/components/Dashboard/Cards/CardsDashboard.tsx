import React, { ReactElement } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'

import {
    Card,
    CardContent,
    // CardDescription,
    // CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Award, Crown, Gamepad2 } from 'lucide-react'

interface CardsDashboardProps {
    title: string
    content: number
	icon: ReactElement
}

const CardsDashboard: React.FC<CardsDashboardProps> = ({ title, content, icon }) => {
    return (
        <div>
            <Card className="flex items-center pl-[16px] h-[100%] rounded-[36px]">
                <div>
                    {icon}
                    {/* <Avatar>
                        <AvatarImage
                            className="w-[70px] h-[70px] rounded-full"
                            src="https://github.com/shadcn.png"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar> */}
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
    )
}

export default CardsDashboard
