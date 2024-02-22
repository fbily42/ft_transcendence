import { LeaveChannelData } from '@/lib/Chat/chat.types'
import React from 'react'

type LeaveChannelProps = {
    cmd: LeaveChannelData
    variant: 'Owner' | 'Other'
}

const LeaveChannel: React.FC<LeaveChannelProps> = ({ cmd, variant }) => {
    if (variant === 'Owner') {
        return (<div></div>)
    } else {
        return (<div></div>)
    }
}
export default LeaveChannel
