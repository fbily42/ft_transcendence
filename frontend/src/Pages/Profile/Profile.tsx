// import SetUp2FAModal from '@/components/Profile/SetUp2FAModal';
import UserScoreCard from '@/components/User/userStats/UserScoreCard'
import UserStatsCard from '@/components/User/userStats/UserStatsCard'
import UserActionsBtns from '@/components/User/userActions/UserActionsBtns'
import { getMyFriends, getUserMe } from '@/lib/Dashboard/dashboard.requests'
import { useQuery } from '@tanstack/react-query'
import UserAvatar from '@/components/User/userAvatar/UserAvatar'
import { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom'
import FriendsList from '@/components/Profile/FriendsList'
import FriendRequest from '@/components/Profile/FriendRequest'
import PendingInvitations from '@/components/Profile/PendingInvitations'

function Profile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 900)
    // const param = useParams()
    const { data: friends } = useQuery({
        queryKey: ['myFriends'],
        queryFn: () => getMyFriends(),
    })
    const handleResize = () => {
        setIsMobile(window.innerWidth < 900)
    }
    useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const { data, isError, isLoading } = useQuery({
        queryKey: ['me'],
        queryFn: getUserMe,
    })
    if (isError) {
        return <div>Error</div>
    }
    if (isLoading) {
        return <div>Loading...</div>
    }

    const selectedAvatar = data?.photo42

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
                <FriendRequest />
                <PendingInvitations />
                <FriendsList friends={friends} />
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
