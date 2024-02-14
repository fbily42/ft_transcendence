import ChannelPanel from '@/components/Chat/ChannelPanel/ChannelPanel'
import ChatWindow from '@/components/Chat/ChatWindow/ChatWindow'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

function Chat() {
    const [currentChannel, setCurrentChannel] = useState<string>('')

    return (
        <div className="flex justify-between h-[90vh] pr-[36px] pb-[36px] pl-[122px] gap-[36px]">
            <ChannelPanel
                currentChannel={currentChannel}
                setCurrentChannel={setCurrentChannel}
            ></ChannelPanel>
            <ChatWindow currentChannel={currentChannel}></ChatWindow>
        </div>
    )
}

export default Chat
