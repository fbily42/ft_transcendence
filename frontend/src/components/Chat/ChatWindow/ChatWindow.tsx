import React, { useState } from 'react'
import Messages from './Messages'

type propTypes = {
	send: (value: string) => void;
	messages: string[];
}

function ChatWindow({send, messages}: propTypes) {

	const [value, setValue] = useState("")

  return (
	<div className="flex flex-col bg-blue-300 w-full ml-10 mr-10 rounded-md border">
	<div className="overflow-y-auto">
	  <Messages messages={messages}></Messages>
	</div>
	<div className="mt-auto">
	  <input
		type="text"
		className="rounded-md border p-2 w-full"
		placeholder="Send a message"
		onChange={(e) => setValue(e.target.value)}
		value={value}
		onKeyDown={(e) => {if (e.key === 'Enter') {send(value); setValue('');}}}
	  />
	</div>
  </div>
  )
}

export default ChatWindow