import ChannelPanel from '@/components/Chat/ChannelPanel/ChannelPanel'
import ChatWindow from '@/components/Chat/ChatWindow/ChatWindow'

function Chat() {
    return (
        <div className="flex justify-between h-[90vh] pr-[36px] pb-[36px] pl-[122px] gap-[36px]">
            <ChannelPanel></ChannelPanel>
            <ChatWindow></ChatWindow>
        </div>
    )
}

export default Chat
