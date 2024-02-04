// import SetUp2FAModal from '@/components/Profile/SetUp2FAModal';
import UserCards from '@/components/User/userCards/UserCards'
import PinguAvatar from '../../assets/empty-state/pingu-face.svg'
import UserScoreCard from '@/components/User/userStats/UserScoreCard'
import UserStatsCard from '@/components/User/userStats/UserStatsCard'
import UserActionsBtns from '@/components/User/userActions/UserActionsBtns'
import { getUserMe } from '@/lib/Dashboard/dashboard.requests'
import { FriendData } from '@/lib/Dashboard/dashboard.types'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import UserAvatar from '@/components/User/userAvatar/UserAvatar'
import { useEffect, useState } from 'react'
import { Photo42 } from '@/assets/avatarAssociation'

function Profile() {
    const { data } = useQuery({ queryKey: ['me'], queryFn: getUserMe })
    const [isMobile, setIsMobile] = useState(window.innerWidth < 900)
    const selectedAvatar = Photo42().imageBackground || ''

    const handleResize = () => {
        setIsMobile(window.innerWidth < 900)
    }

    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize)

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    // const queryClient = useQueryClient()
    // const user: UserData = await queryClient.ensureQueryData({
    //     queryKey: ['me'],
    //     queryFn: getUserMe,
    // })
    const friends = data?.friends
    return (
        <div
            className={`flex ${isMobile ? 'flex-col h-screen overflow-y-auto' : 'justify-between'} pl-[102px] md:pl-[112px] lg:pl-[122px] pb-[36px] pr-[16px] md:pr-[26px] lg:pr-[36px] h-[90vh] gap-[16px] md:gap-[26px] lg:gap-[36px]`}
        >
            <div
                id="User infos"
                className={`${isMobile ? 'w-full ' : 'w-[60%] sm:w-[60%] md:w-[70%] lg:w-[80%]'} ${isMobile ? 'h-full' : 'h-full'} flex  flex-col rounded-[26px] md:rounded-[30px] lg:rounded-[36px] shadow-drop`}
            >
                <div
                    id="User top info"
                    className={`flex ${isMobile ? 'flex-col ' : 'flex-row h-[50%] w-full items-center justify-center'} bg-white rounded-t-[26px] md:rounded-t-[30px] lg:rounded-t-[36px]`}
                >
                    <div
                        id="User top info + padding"
                        className={`flex ${isMobile ? 'flex-col items-center h-auto gap-[16px]' : 'flex-row h-full'} w-full p-[36px]`}
                    >
                        <div
                            id="User avatar"
                            className={`flex ${isMobile ? 'w-[50%] h-[50%] justify-center' : 'w-[50%] h-full justify-center items-center'}`}
                        >
                            <UserAvatar selectedAvatar={selectedAvatar} />
                            {/* <img src={data?.photo42} alt="Avatar Image" /> */}
                        </div>
                        <div
                            id="User informations"
                            className={`${isMobile ? 'w-full h-auto flex justify-end gap-[16px]' : 'w-[50%] h-full justify-between'} flex flex-col `}
                        >
                            <UserScoreCard />
                            <UserStatsCard />
                            <UserActionsBtns />
                        </div>
                    </div>
                </div>
                <div
                    id="User bottom info"
                    className={`flex ${isMobile ? 'h-full' : 'h-[50%]'} w-full justify-between bg-[#C1E2F7] rounded-b-[26px] md:rounded-b-[30px] lg:rounded-b-[36px]`}
                ></div>
            </div>
            <div
                id="User friends"
                className={`${isMobile ? 'w-full' : 'w-[40%] sm:w-[40%] md:w-[30%] lg:w-[30%]'} ${isMobile ? 'h-fit' : 'h-full'} flex flex-col bg-white rounded-[26px] md:rounded-[30px] lg:rounded-[36px] gap-[36px] shadow-drop`}
            >
                <div className="bg-[#C1E2F7] flex justify-start items-center w-full h-[70px] px-[15px] sm:px-[15px] md:px-[20px] lg:px-[30px] py-[15px] sm:py-[15px] md:py-[15px] lg:py-[30px] rounded-t-[26px] md:rounded-t-[30px] lg:rounded-t-[36px]">
                    <h1 className="flex justify-start items-center h-[31px] text-base sm:text-md md:text-lg lg:text-2xl font-semibold">
                        Noot Friends
                    </h1>
                </div>
                <div className="bg-white w-full h-full rounded-[26px] md:rounded-[30px] lg:rounded-[36px] gap-[36px]">
                    {friends && friends.length > 0 ? (
                        friends.map((friend: FriendData) => (
                            <UserCards
                                key={friend.id}
                                bgColor="white"
                                userName={friend.name} // Adjust accordingly
                                userPicture={friend.avatar || PinguAvatar}
                                userStatus={friend.status || 'Status undifined'}
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
        </div>
    )
}

export default Profile

// <div>
//     <SetUp2FAModal
//         open={openSetUp2FA}
//         onClose={() => {setOpenSetUp2FA(false)}}
//     />
// </div>
