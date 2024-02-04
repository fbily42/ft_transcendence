import PinguProfile from './empty-state/pingu-face.svg'
import PinguBg from './avatar-assets/Pingu.svg'
import PingaProfile from './avatar-assets/pinga-face.svg'
import PingaBg from './avatar-assets/Pinga.svg'
import MamaProfile from './avatar-assets/mama-face.svg'
import MamaBg from './avatar-assets/Mama.svg'
import PapaProfile from './avatar-assets/papa-face.svg'
import PapaBg from './avatar-assets/Papa.svg'
import PingiProfile from './avatar-assets/pingi-face.svg'
import PingiBg from './avatar-assets/Pingi.svg'
import RobbyProfile from './avatar-assets/robby-face.svg'
import RobbyBg from './avatar-assets/Robby.svg'
import { useQuery } from '@tanstack/react-query'
import { getUserMe } from '@/lib/Dashboard/dashboard.requests'
import { UserData } from '@/lib/Dashboard/dashboard.types'

export function Pingu() {
    return {
        id: 1,
        imageProfile: PinguProfile,
        imageBackground: PinguBg,
    }
}

export function Pinga() {
    return {
        id: 2,
        imageProfile: PingaProfile,
        imageBackground: PingaBg,
    }
}

export function Mama() {
    return {
        id: 3,
        imageProfile: MamaProfile,
        imageBackground: MamaBg,
    }
}

export function Papa() {
    return {
        id: 4,
        imageProfile: PapaProfile,
        imageBackground: PapaBg,
    }
}

export function Pingi() {
    return {
        id: 5,
        imageProfile: PingiProfile,
        imageBackground: PingiBg,
    }
}

export function Robby() {
    return {
        id: 6,
        imageProfile: RobbyProfile,
        imageBackground: RobbyBg,
    }
}

export function Photo42() {
    const { data } = useQuery<UserData>({
        queryKey: ['me'],
        queryFn: getUserMe,
    })

    const result: {
        id: number
        imageProfile: string
        imageBackground: string | undefined
    } = {
        id: 7,
        imageProfile: data?.photo42 || '',
        imageBackground: data?.photo42 || '',
    }

    return result
}
