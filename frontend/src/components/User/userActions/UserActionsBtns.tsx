import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'

export default function UserActionsBtns() {
    const [flexDirection, setFlexDirection] = useState('flex-col')

    const handleResize = () => {
        setFlexDirection(window.innerWidth < 900 ? 'flex-col' : 'flex-row')
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
            className={`w-full bg-red-400 flex ${flexDirection} justify-between gap-[14px]`}
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
