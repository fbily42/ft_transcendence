import ChannelPanel from '@/components/Chat/ChannelPanel/ChannelPanel'
import ChatWindow from '@/components/Chat/ChatWindow/ChatWindow'
import UserList from '@/components/Chat/UserList/UserList'
import React, { useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'

function Chat() {

	const [socket, setSocket] = useState<Socket>()
	const [messages, setMessages] = useState<string[]>([])

	const send = (value: string) => {
		socket?.emit('message', value)
	}

	useEffect(() => {
		const newSocket=io('http://localhost:8081',{
			withCredentials: true,
		})
		setSocket(newSocket)
	},[setSocket])

	const messageListener = (message: string) => {
		setMessages([...messages, message])
	}

	useEffect(() => {
		socket?.on('message', messageListener)
		return () => {socket?.off('message', messageListener)}
	}, [messageListener])

  return (
    <div className='flex h-[88vh] ml-32'>
		<ChannelPanel></ChannelPanel>
		<UserList></UserList>
		<ChatWindow send={send} messages={messages}></ChatWindow>
	</div>
  )
}

export default Chat