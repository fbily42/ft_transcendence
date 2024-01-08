import React from 'react'
import ChannelList from './ChannelList';
import ChatBox from './ChatBox';
import ChannelUsers from './ChannelUsers';

function Chat() {
  return (
    <div className='flex h-screen'>
		<div className='flex-1 flex flex-col'>
			<ChannelList></ChannelList>
			<ChatBox></ChatBox>
		</div>
		<div className='w-1/4'>
			<ChannelUsers></ChannelUsers>
		</div>
	</div>
  ); 
}

export default Chat