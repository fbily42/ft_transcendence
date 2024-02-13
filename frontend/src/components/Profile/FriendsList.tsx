import { UserData } from '@/lib/Dashboard/dashboard.types'
import PinguAvatar from '../../assets/empty-state/pingu-face.svg'
import UserCards from '../User/userCards/UserCards'
import { Skeleton } from '../ui/skeleton'
import { getUsers } from '@/lib/Dashboard/dashboard.requests'
import { useQuery } from '@tanstack/react-query'

export default function FriendsList() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['users'],
        queryFn: () => getUsers(),
    })

    if (isError) {
        return <div>Error</div>
    }
    if (isLoading) {
        return <div>Loading...</div>
    }

    const users: UserData[] = Array.isArray(data)
        ? data.filter(Boolean)
        : data
          ? [data]
          : []

    return (
        <div>
            <div className="bg-white w-full flex flex-col rounded-[26px] md:rounded-[30px] lg:rounded-[36px] ">
                {users && users.length > 0 ? (
                    users.map((user) => (
                        <UserCards
                            id={user.id}
                            key={user.id} // Utilisez l'ID de l'utilisateur comme clé
                            bgColor="white"
                            userName={user.name}
                            userPicture={user.photo42 || PinguAvatar}
                            userStatus={'Status undifined'}
                            variant="USER_PROFILE"
                        />
                    ))
                ) : (
                    <div className="flex items-center justify-center w-full h-[68px] px-[6px] sm:px-[16px] md:px-[26px] gap-[10px]">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="w-full h-full flex flex-col justify-center gap-1">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-[100px]" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
