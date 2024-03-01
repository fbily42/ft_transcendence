import NoAchievements from '@/assets/badges/No achivement.png'
import FirstFriendBadge from '@/assets/badges/1st friend.png'
import FirstWinBadge from '@/assets/badges/1st win.png'
import FirstChannelBadge from '@/assets/badges/1st channel.png'
import FirstGameBadge from '@/assets/badges/1st game.png'
import { Badge } from '@/lib/Profile/profile.types'

export const FirstFriend: Badge = {
	src: FirstFriendBadge,
	emptyState: NoAchievements,
	string: "FIRST_FRIEND"
}

export const FirstChannel: Badge = {
	src: FirstChannelBadge,
	emptyState: NoAchievements,
	string: "FIRST_CHANNEL"
}

export const FirstWin: Badge = {
	src: FirstWinBadge,
	emptyState: NoAchievements,
	string: "FIRST_WIN"
}

export const FirstGame: Badge = {
	src: FirstGameBadge,
	emptyState: NoAchievements,
	string: "FIRST_GAME"
}