import React from 'react'

function ChatWindow() {
  return (
	<div className="flex flex-col bg-blue-300 w-full ml-10 mr-10 rounded-md border">
	<div className="overflow-y-auto">
	  Messages List
	</div>
	<div className="mt-auto">
	  <input
		type="text"
		className="rounded-md border p-2 w-full"
		placeholder="Send a message"
	  />
	  {/* Bouton d'envoi */}
	</div>
  </div>
  )
}

export default ChatWindow