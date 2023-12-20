import React from 'react'

function ChannelUsers() {

  const channelUsers = [ 'Pingu', 'Pinga' ];

  return (
	<div className='bg-gray-200 p-4 h-full overflow-y-auto'>
		{channelUsers.map((user, index) => (
			<div key={index} className='mb-2'>
				{user}
			</div>
		))}
	</div>
  );
};

export default ChannelUsers