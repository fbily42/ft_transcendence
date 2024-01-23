import React from 'react'
import UserCards from '@/components/User/userCards/UserCards'

function Profile(){
    return (
        <div className="flex justify-between pl-[102px] md:pl-[112px] lg:pl-[122px] pb-[36px] pr-[16px] md:pr-[26px] lg:pr-[36px] h-[90vh] gap-[16px] md:gap-[26px] lg:gap-[36px]">
            <div className="flex flex-col w-[60%] sm:w-[60%] md:w-[70%] lg:w-[80%] h-full rounded-[26px] md:rounded-[30px] lg:rounded-[36px] shadow-drop">
                <div className="flex w-full h-[50%] justify-between bg-blue-100 rounded-t-[26px] md:rounded-t-[30px] lg:rounded-t-[36px]"></div>
                <div className="flex w-full h-[50%] justify-between bg-blue-200 rounded-b-[26px] md:rounded-b-[30px] lg:rounded-b-[36px]"></div>
            </div>
            <div className="flex flex-col w-[40%] sm:w-[40%] md:w-[30%] lg:w-[30%] h-full bg-white rounded-[26px] md:rounded-[30px] lg:rounded-[36px] gap-[36px] shadow-drop">
                <div className="bg-blue-200 flex justify-start items-center w-full h-[70px] px-[15px] sm:px-[15px] md:px-[20px] lg:px-[30px] py-[15px] sm:py-[15px] md:py-[15px] lg:py-[30px] rounded-t-[26px] md:rounded-t-[30px] lg:rounded-t-[36px]">
                    <h1 className="flex justify-start items-center h-[31px] text-base sm:text-md md:text-lg lg:text-2xl font-semibold">
                        Noot Friends
                    </h1>
                </div>
                <div className="bg-white w-full h-full rounded-[26px] md:rounded-[30px] lg:rounded-[36px] gap-[36px]">
                  <UserCards 
                    userName='Dupont'
                    userPicture=''
                    userStatus='Online'
                  />
                </div>
            </div>
        </div>
    )
}

export default Profile
