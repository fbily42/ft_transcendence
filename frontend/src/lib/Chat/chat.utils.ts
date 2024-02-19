import { WebSocketContextType } from "@/context/webSocketContext"
import { UserInChannel } from "./chat.types"

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

export function getRole(user: UserInChannel): string {
    const statusKeys: (keyof UserInChannel)[] = [
        'owner',
        'admin',
        'member',
        'muted',
		'banned',
    ]
    for (let key of statusKeys) {
        if (user[key] === true) return key
    }
    return 'member'
}

export function getMyrole(name: string, users: UserInChannel[]): string {
	if (!name || !users)
		return ''
	const user = users.find(userInChannel => userInChannel.name === name)
	if (user)
		return getRole(user)
	return ''
}