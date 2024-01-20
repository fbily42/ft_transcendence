import React from 'react'

function Messages({messages}:{messages: string[]}) {
  return (
	<div>
		{messages.map((message, index) => (
			<div key={index}>{message}</div>
		))}
	</div>
  )
}

export default Messages