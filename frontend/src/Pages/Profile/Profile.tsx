import SetUp2FAModal from '@/components/Profile/SetUp2FAModal';
import UserCards from '@/components/User/userCards/UserCards'
// <<<<<<< dashboard
// import PinguAvatar from '../../assets/empty-state/pingu-face.svg'
// import UserScoreCard from '@/components/User/userStats/UserScoreCard'
// import UserStatsCard from '@/components/User/userStats/UserStatsCard'
// import UserActionsBtns from '@/components/User/userActions/UserActionsBtns'
// import { getUserMe } from '@/lib/Dashboard/dashboard.requests'
// import { FriendData } from '@/lib/Dashboard/dashboard.types'
// import { useQuery } from '@tanstack/react-query'
// import { Skeleton } from '@/components/ui/skeleton'
// import UserAvatar from '@/components/User/userAvatar/UserAvatar'
// import { useEffect, useState } from 'react'

// function Profile() {
//     const { data } = useQuery({ queryKey: ['me'], queryFn: getUserMe })
//     const [isMobile, setIsMobile] = useState(window.innerWidth < 900)

//     const handleResize = () => {
//         setIsMobile(window.innerWidth < 900)
//     }

//     useEffect(() => {
//         handleResize()
//         window.addEventListener('resize', handleResize)

//         // Cleanup the event listener on component unmount
//         return () => {
//             window.removeEventListener('resize', handleResize)
//         }
//     }, [])

//     // const queryClient = useQueryClient()
//     // const user: UserData = await queryClient.ensureQueryData({
//     //     queryKey: ['me'],
//     //     queryFn: getUserMe,
//     // })
//     const friends = data?.friends
//     return (
//         <div
//             className={`flex ${isMobile ? 'flex-col h-screen overflow-y-auto' : 'justify-between'} pl-[102px] md:pl-[112px] lg:pl-[122px] pb-[36px] pr-[16px] md:pr-[26px] lg:pr-[36px] h-[90vh] gap-[16px] md:gap-[26px] lg:gap-[36px]`}
//         >
//             <div
//                 id="User infos"
//                 className={`${isMobile ? 'w-full ' : 'w-[60%] sm:w-[60%] md:w-[70%] lg:w-[80%]'} ${isMobile ? 'h-full' : 'h-full'} flex  flex-col rounded-[26px] md:rounded-[30px] lg:rounded-[36px] shadow-drop`}
//             >
//                 <div
//                     id="User top info"
//                     className={`flex ${isMobile ? 'flex-col ' : 'flex-row h-[50%] w-full items-center justify-center'} bg-white rounded-t-[26px] md:rounded-t-[30px] lg:rounded-t-[36px]`}
//                 >
//                     <div
//                         id="User top info + padding"
//                         className={`flex ${isMobile ? 'flex-col items-center h-auto gap-[16px]' : 'flex-row h-full'} w-full p-[36px]`}
//                     >
//                         <div
//                             id="User avatar"
//                             className={`flex ${isMobile ? 'w-[50%] h-[50%] justify-center' : 'w-[50%] h-full justify-center items-center'}`}
//                         >
//                             <UserAvatar isMobile={isMobile} />
//                         </div>
//                         <div
//                             id="User informations"
//                             className={`${isMobile ? 'w-full h-auto flex justify-end gap-[16px]' : 'w-[50%] h-full justify-between'} flex flex-col `}
//                         >
//                             <UserScoreCard />
//                             <UserStatsCard />
//                             <UserActionsBtns />
// =======
import { Button } from '@/components/ui/button'
import { useState } from 'react'

function Profile() {
    const [openSetUp2FA, setOpenSetUp2FA] = useState<boolean>(false);

    return (
        <div className="flex justify-between pl-[102px] md:pl-[112px] lg:pl-[122px] pb-[36px] pr-[16px] md:pr-[26px] lg:pr-[36px] h-[90vh] gap-[16px] md:gap-[26px] lg:gap-[36px]">
            <div className="flex flex-col w-[60%] sm:w-[60%] md:w-[70%] lg:w-[80%] h-full rounded-[26px] md:rounded-[30px] lg:rounded-[36px] shadow-drop">
                <div className="flex w-full items-center justify-center h-[50%] bg-white rounded-t-[26px] md:rounded-t-[30px] lg:rounded-t-[36px]">
                    <div className="flex w-full h-full bg-red-100 p-[16px] md:p-[26px] lg:p-[36px]">
                        <div className="w-[50%] h-full bg-red-200"></div>
                        <div className="w-[50%] h-full bg-red-300 flex flex-col justify-between">
                            <div className="w-full p-[30px] border border-[#C1E2F7] rounded-[30px]">
                                <div className="w-full flex justify-between">
                                    <div className="flex inline-block items-center">
                                        <div className="bg-red-100">
                                            <h1 className="text-base sm:text-md md:text-lg lg:text-2xl font-semibold">
                                                My level
                                            </h1>
                                            <div>
                                                <p className="text-[12px]">
                                                    0/100xp
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-red-500">
                                        <div className="w-[71px] h-[71px]"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full bg-red-400 p-[30px]"></div>
                            <div className="w-full bg-red-400 flex justify-between gap-[14px]">
                                <Button className="w-full" variant={'default'}>
                                    Change Avatar
                                </Button>
                                <Button
                                    variant={'outlineBlue'}
                                    className="w-full"
                                    onClick={() => {setOpenSetUp2FA(true)}}
                                >
                                    Setup 2FA
                                </Button>
                            </div>
<!-- >>>>>>> test -->
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
            <div>
                <SetUp2FAModal
                    open={openSetUp2FA}
                    onClose={() => {setOpenSetUp2FA(false)}}
                />
            </div>
        </div>
    )
}

export default Profile
