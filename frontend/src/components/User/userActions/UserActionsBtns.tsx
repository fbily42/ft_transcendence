import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'

export default function UserActionsBtns() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 900)

    const handleResize = () => {
        setIsMobile(window.innerWidth < 900)
    }

    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize)

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])  

    return (
        <div
            id="Buttons"
            className={`w-full flex gap-[12px] md:gap-[8px] lg:gap-[26px]`}
        >
            <Button className="w-full" variant={'default'}>
                Change Avatar
            </Button>
            <Button variant={'outlineBlue'} className="w-full">
                Setup 2FA
            </Button>
        </div>
    )
}
