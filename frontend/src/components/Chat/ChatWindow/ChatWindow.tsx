import React, { useEffect, useState } from 'react'
import Messages from './Messages'
import { useWebSocket } from '@/context/webSocketContext';
import { Socket } from 'socket.io-client';

function ChatWindow() {

	const [value, setValue] = useState<string>("")
	const socket = useWebSocket() as Socket
	const [messages, setMessages] = useState<string[]>([])

	//Send an event 'message' to WebSocket with value as argument
	const send = (value: string) => {
		socket?.emit('message', value)
	};

	//Save the message in a string array
	const messageListener = (message: string) => {
		setMessages([...messages, message])
	};

	//On = Listen to the event 'message' then call messageListener() with the given arguments
	//Off = Stop listenning when component is unmount
	useEffect(() => {
		socket?.on('message', messageListener)
		return () => {
			socket?.off('message', messageListener)
		}
	}, [socket, messageListener]);

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