import UserCards from '@/components/User/userCards/UserCards'
import { Button } from '@/components/ui/button'
import PinguAvatar from '../../assets/empty-state/pingu-face.svg'

function Profile() {
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
                                >
                                    Setup 2FA
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex w-full h-[50%] justify-between bg-[#C1E2F7] rounded-b-[26px] md:rounded-b-[30px] lg:rounded-b-[36px]"></div>
            </div>
            <div className="flex flex-col w-[40%] sm:w-[40%] md:w-[30%] lg:w-[30%] h-full bg-white rounded-[26px] md:rounded-[30px] lg:rounded-[36px] gap-[36px] shadow-drop">
                <div className="bg-[#C1E2F7] flex justify-start items-center w-full h-[70px] px-[15px] sm:px-[15px] md:px-[20px] lg:px-[30px] py-[15px] sm:py-[15px] md:py-[15px] lg:py-[30px] rounded-t-[26px] md:rounded-t-[30px] lg:rounded-t-[36px]">
                    <h1 className="flex justify-start items-center h-[31px] text-base sm:text-md md:text-lg lg:text-2xl font-semibold">
                        Noot Friends
                    </h1>
                </div>
                <div className="bg-white w-full h-full rounded-[26px] md:rounded-[30px] lg:rounded-[36px] gap-[36px]">
                    <UserCards
                        userName="Dupont"
                        userPicture={PinguAvatar}
                        userStatus="Online"
                        variant="USER_PROFILE"
                    />
                </div>
            </div>
        </div>
    )
}

export default Profile
