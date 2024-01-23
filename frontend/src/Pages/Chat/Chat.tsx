import ChannelPanel from '@/components/Chat/ChannelPanel/ChannelPanel'
import ChatWindow from '@/components/Chat/ChatWindow/ChatWindow'
import UserList from '@/components/Chat/UserList/UserList'

function Chat() {

  return (
    <div className='flex h-[88vh] ml-32'>
		<ChannelPanel></ChannelPanel>
		<UserList></UserList>
		<ChatWindow></ChatWindow>
	</div>
  )
}

export default Chat