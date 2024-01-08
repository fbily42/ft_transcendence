import ChannelPanel from '@/components/Chat/ChannelPanel'
import ChatWindow from '@/components/Chat/ChatWindow'
import UserList from '@/components/Chat/UserList'
import React from 'react'

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