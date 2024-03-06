import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import { useEffect, useState } from 'react'
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import { UserData } from '@/lib/Dashboard/dashboard.types'
import { getUserMe, getUsers } from '@/lib/Dashboard/dashboard.requests'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { Link } from 'react-router-dom'
import { WebSocketContextType, useWebSocket } from '@/context/webSocketContext'
import { AvatarFallback } from '../ui/avatar'
import PinguAvatar from '@/assets/empty-state/pingu-face.svg'

export function Searchbar(): JSX.Element {
    const [isFocused, setIsFocused] = useState<boolean>(false)
    const [searchTerm] = useState<string>('')
    const socket = useWebSocket() as WebSocketContextType
    const queryClient = useQueryClient() as QueryClient

    const { data: users } = useQuery<UserData[]>({
        queryKey: ['users'],
        queryFn: getUsers,
    })

    const { data: currentUser } = useQuery<UserData>({
        queryKey: ['me'],
        queryFn: getUserMe,
    })

    const filteredUsers = users?.filter((user) => {
        if (user && user.pseudo) {
            return user.pseudo.toLowerCase().includes(searchTerm.toLowerCase())
        }
    })

    useEffect(() => {
        socket?.webSocket?.on('refreshSearchBar', () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        })

        return () => {
            socket?.webSocket?.off('refreshSearchBar')
        }
    }, [socket])

    return (
        <div className="relative ">
            <Command
                className="border rounded-xl"
                onBlur={(e: React.FocusEvent<HTMLDivElement, Element>) => {
                    e.relatedTarget === null && setIsFocused(false)
                }}
            >
                <CommandInput
                    placeholder="Search for Noots..."
                    onFocus={() => setIsFocused(true)}
                />
                {isFocused && (
                    <div className="absolute z-50 mt-[50px] bg-white rounded-xl w-full shadow-drop">
                        <CommandList className="no-scrollbar">
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {filteredUsers?.map(
                                    (user) =>
                                        user.pseudo !== currentUser?.pseudo && (
                                            <Link
                                                key={user.id}
                                                to={`/profile/${user.id}`}
                                                onClick={() =>
                                                    setIsFocused(false)
                                                }
                                            >
                                                <CommandItem className="flex items-center rounded-lg gap-4">
                                                    <Avatar className="border-[3px] border-customDarkBlue rounded-full">
                                                        <AvatarImage
                                                            className="rounded-full object-cover w-[40px] h-[40px]"
                                                            src={user.avatar}
                                                        />
                                                        <AvatarFallback>
                                                            <img
                                                                className="w-full h-full rounded-full object-cover"
                                                                src={
                                                                    PinguAvatar
                                                                }
                                                                alt="pingu"
                                                            />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-semibold">
                                                        {user.pseudo}
                                                    </span>
                                                </CommandItem>
                                            </Link>
                                        )
                                )}
                            </CommandGroup>
                        </CommandList>
                    </div>
                )}
            </Command>
        </div>
    )
}
