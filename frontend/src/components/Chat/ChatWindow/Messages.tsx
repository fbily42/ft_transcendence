import React from 'react'

function Messages({ messages }: { messages: string[] }) {
    return (
        <>
            {messages.map((message, index) => (
                <div key={index}>{message}</div>
            ))}
        </>
    )
}

export default Messages
