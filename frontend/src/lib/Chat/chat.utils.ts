import { WebSocketContextType } from "@/context/webSocketContext"

export function getDirectName(channel: string, user: string | null): string {
	const names: string[] = channel?.split('_')
	if (!names || names.length < 2)
		return channel
	if (names[0] === user)
		return names[1]
	else
		return names[0]
}

export function getUserStatus(socket: WebSocketContextType, user: string): boolean{ 
	const webSocketStatus = socket.usersOn.has(user)

    if (webSocketStatus === true) {
        return true
    } else {
        return false
    }
}