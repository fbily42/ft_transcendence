import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { UserData } from '@/lib/Dashboard/dashboard.types'
import { getUserMe, getUsers } from '@/lib/Dashboard/dashboard.requests'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { Link } from 'react-router-dom'

export function Searchbar() {
    const [isFocused, setIsFocused] = useState(false)
    const [searchTerm] = useState<string>('')
    const [selectedUser] = useState(null)

    const { data: users } = useQuery<UserData[]>({
        queryKey: ['users'],
        queryFn: getUsers,
    })

    const { data: currentUser } = useQuery<UserData>({
        queryKey: ['me'],
        queryFn: getUserMe,
    })

    const filteredUsers = users?.filter((user) =>
        user.pseudo.toLowerCase().includes(searchTerm.toLowerCase())
    )

    useEffect(() => {
        if (selectedUser) {
            window.location.href = `/profile/${selectedUser}`
        }
    }, [selectedUser])

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
                        <CommandList>
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
                                                    <Avatar className="w-[48px] h-[48px] border-[3px] border-customDarkBlue rounded-full">
                                                        <AvatarImage
                                                            className="rounded-full object-cover w-[40px] h-[40px]"
                                                            src={user.avatar}
                                                        />
                                                    </Avatar>
                                                    <span className='font-semibold'>{user.pseudo}</span>
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
