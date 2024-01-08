import React from 'react'

function ChatBox() {

	// Temp messages
  const messages = [
	{ text: 'Noot !', user: 'Pingu' },
	{ text: 'Nut !', user: 'Pinga' },
  ];

  return (
	<div className='flex flex-col h-full'>
		<div className='bg-gray-300 flex-1 p-4 overflow-y-auto'>
			{messages.map((message, index) => (
				<div key={index} className='mb-2'>
					<span className='front-semibold'>{message.user}: {message.text}</span>
				</div>
			))}
		</div>
		<div className='bg-gray-100 p-4'>
			<input
				type='text'
				placeholder='Type your message...'
				className='w-full p-2 rounded border'>
			</input>
		</div>
	</div>
  );
};

export default ChatBox