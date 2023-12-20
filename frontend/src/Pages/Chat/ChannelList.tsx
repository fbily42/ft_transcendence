import { Button } from '@/components/ui/button';
import React from 'react'

function ChannelList() {

	//Temp list of channel
  const channels = [ 'Channel 1', 'Channel 2', 'Channel 3' ];

  return (
	<div className='bg-gray-700 p-4 overflow-x-auto'>
		{channels.map((channel, index) => (
			<Button key={index}> {channel}
			</Button>
		))}
	</div>
  );
};

export default ChannelList;