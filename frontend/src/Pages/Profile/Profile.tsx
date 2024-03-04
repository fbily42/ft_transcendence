// import SetUp2FAModal from '@/components/Profile/SetUp2FAModal';
import UserActionsBtns from '@/components/User/userActions/UserActionsBtns'
import {
    getFriendRequest,
    getPendingInvitations,
    getUserMe,
} from '@/lib/Dashboard/dashboard.requests'
import { useQuery } from '@tanstack/react-query'
import UserAvatar from '@/components/User/userAvatar/UserAvatar'
import { useEffect, useState } from 'react'
import FriendRequest from '@/components/Profile/FriendRequest'
import PendingInvitations from '@/components/Profile/PendingInvitations'
import MyFriendList from '@/components/Profile/MyFriendList'
import { FriendData } from '@/lib/Dashboard/dashboard.types'
import MyUserStatsCard from '@/components/User/userStats/MyUserStatsCard'
import MyUserScoreCard from '@/components/User/userStats/MyUserScoreCard'
import MyGameHistory from '@/components/Profile/MyGameHistory/MyGameHistory'
import Seperator from '@/assets/other/Seperator.svg'
import Mountain from '@/assets/other/mountain.svg'

function Profile() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 900)

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

    const { data: friendRequest } = useQuery<FriendData[]>({
        queryKey: ['request'],
        queryFn: getFriendRequest,
    })

    const { data: friendInvites } = useQuery<FriendData[]>({
        queryKey: ['pending'],
        queryFn: getPendingInvitations,
    })

    const { data } = useQuery({
        queryKey: ['me'],
        queryFn: getUserMe,
    })

    const selectedAvatar = data?.avatar

    return (
        <div
            className={`flex ${isMobile ? 'flex-col h-screen no-scrollbar' : 'justify-between'} pl-[102px] md:pl-[112px] lg:pl-[122px] pb-[36px] pr-[16px] md:pr-[26px] lg:pr-[36px] h-[90vh] gap-[16px] md:gap-[26px] lg:gap-[36px]`}
        >
            <div
                id="User infos"
                className={`${isMobile ? 'w-full ' : 'w-[60%] sm:w-[60%] md:w-[70%] lg:w-[80%]'} ${isMobile ? 'h-full' : 'h-full'} flex  flex-col rounded-[26px] md:rounded-[30px] lg:rounded-[36px] shadow-drop`}
            >
                <div
                    id="User top info"
                    className={`flex justify-center ${isMobile ? 'flex-col ' : 'flex-row h-[50%] w-full items-center'} bg-white rounded-t-[26px] md:rounded-t-[30px] lg:rounded-t-[36px]`}
                >
                    <div
                        id="User top info + padding"
                        className={`flex justify-center gap-10 items-center ${isMobile ? 'flex-col items-center h-auto gap-[16px]' : 'flex-row h-full'} w-full p-[36px]`}
                    >
                        <div
                            id="User avatar"
                            className={`flex justify-center items-center w-[150px] h-[150px] md:w-[200px] md:h-[200px] lg:w-[300px] lg:h-[300px] border-[5px] border-customDarkBlue rounded-full overflow-hidden`}
                        >
                            <UserAvatar selectedAvatar={selectedAvatar} />
                        </div>
                        <div
                            id="User informations"
                            className={`${isMobile ? 'w-full h-auto flex justify-end gap-[16px]' : 'w-[50%] h-full justify-between'} flex flex-col `}
                        >
                            <MyUserScoreCard />
                            <MyUserStatsCard />
                            <UserActionsBtns />
                        </div>
                    </div>
                </div>
                <div className="bg-white w-full">
                    <img className="w-full" src={Seperator} />
                </div>
                <div
                    id="User bottom info"
                    className={`flex ${isMobile ? 'h-full' : 'h-[50%]'} w-full justify-between bg-white rounded-b-[26px] md:rounded-b-[30px] lg:rounded-b-[36px]`}
                >
                    <MyGameHistory />
                </div>
            </div>
            <div
                id="User friends"
                className={`${isMobile ? 'w-full' : 'w-[40%] sm:w-[40%] md:w-[30%] lg:w-[30%]'} ${isMobile ? 'h-full' : 'h-full'} flex flex-col bg-white rounded-[26px] md:rounded-[30px] lg:rounded-[36px] shadow-drop`}
            >
                <div className="bg-[#C1E2F7] relative flex justify-start items-center w-full h-[70px] px-[15px] sm:px-[15px] md:px-[20px] lg:px-[30px] py-[15px] sm:py-[15px] md:py-[15px] lg:py-[30px] rounded-t-[26px] md:rounded-t-[30px] lg:rounded-t-[36px] overflow-hidden">
                    <h1 className="flex justify-start items-center h-[31px] text-base sm:text-md md:text-lg lg:text-2xl font-semibold">
                        Noot Friends
                    </h1>
                    <img src={Mountain} className="absolute -bottom-2 left-0" />
                    <img
                        src={Mountain}
                        className="absolute -bottom-2 left-[310px]"
                    />
                    <img
                        src={Mountain}
                        className="absolute -bottom-2 left-[620px]"
                    />
                </div>
                {friendRequest && friendRequest.length > 0 ? (
                    <FriendRequest />
                ) : (
                    <div />
                )}
                {friendInvites && friendInvites.length > 0 ? (
                    <PendingInvitations />
                ) : (
                    <div />
                )}
                <div className="overflow-auto no-scrollbar max-h-[500px]">
                    <MyFriendList />
                </div>
            </div>
        </div>
    )
}

export default Profile
