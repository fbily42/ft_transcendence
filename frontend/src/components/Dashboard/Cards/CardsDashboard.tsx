import React, { ReactElement, useEffect, useState } from 'react'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

interface CardsDashboardProps {
    title: string
    content: number
    icon: ReactElement
    backgroundColor: string
}

const CardsDashboard: React.FC<CardsDashboardProps> = ({
    title,
    content,
    icon,
    backgroundColor,
}) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 900)

    const handleResize = () => {
        setIsMobile(window.innerWidth < 900)
    }
    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])
    return (
        <div className='h-full'>
            <Card style={{ backgroundColor }} className={`flex border-none shadow-drop ${isMobile ? 'flex-col justify-center items-center h-full' : 'items-center pl-[16px] h-full'} rounded-[30px]`}>
                <div>
                    {icon}
                </div>
                <div className={`flex ${isMobile ? 'flex-col items-center' : 'flex-col'}`}>
                    <CardHeader className={`flex ${isMobile ? 'p-0 items-center justify-center text-center': ''}`}>
                        <CardTitle>{title}</CardTitle>
                    </CardHeader>
                    <CardContent className='py-0'>
                        <p className="text-[30px]">{content}</p>
                    </CardContent>
                </div>
            </Card>
        </div>
    )
}

export default CardsDashboard
