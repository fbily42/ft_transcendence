import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import PinguLogo from '../../assets/welcome-assets/PinguLogo.svg'
import PinguFamily from '../../assets/welcome-assets/PinguFamily.svg'
import PinguAnim from '../../assets/welcome-assets/PinguAnim.mp4'
import SnowCoverTop from '../../assets/welcome-assets/SnowCoverTop.svg'
import SnowCoverBottom from '../../assets/welcome-assets/SnowCoverBottom.svg'
import Snow from './Snow'
import LoginButton from './LoginButton'
import SetProfileForm from './SetProfileForm'

type Loginprops = {
    children: React.ReactNode
    isAuth: boolean
}

const Login: React.FC<Loginprops> = ({ children, isAuth }) => {
    return (
        <div className="relative flex h-[100vh] bg-background">
            <div className="absolute z-10">
                <Snow />
            </div>
            <div className="flex-1 flex flex-col justify-between items-center p-[36px]">
                <div>
                    <img src={PinguLogo}></img>
                </div>
                <div className="flex flex-col gap-y-[36px] items-center">
                    {isAuth ? (
                        <SetProfileForm>{children}</SetProfileForm>
                    ) : (
                        <LoginButton>{children}</LoginButton>
                    )}
                </div>
                <div>
                    <img src={PinguFamily}></img>
                </div>
            </div>
            <div className="hidden lg:flex lg:flex-1 p-[36px] h-full">
                <div className="flex flex-col justify-center h-full rounded-3xl overflow-hidden">
                    <div className="relative flex justify-center items-center h-full">
                        <div className="absolute flex flex-col justify-between items-center h-full w-full">
                            <div className="flex -space-x-[13px]">
                                <div className="w-full">
                                    <img src={SnowCoverTop}></img>
                                </div>
                                <div className="w-full">
                                    <img src={SnowCoverTop}></img>
                                </div>
                                <div className="w-full">
                                    <img src={SnowCoverTop}></img>
                                </div>
                            </div>
                            <div className="flex -space-x-[2px]">
                                <div>
                                    <img src={SnowCoverBottom}></img>
                                </div>
                                <div>
                                    <img src={SnowCoverBottom}></img>
                                </div>
                                <div>
                                    <img src={SnowCoverBottom}></img>
                                </div>
                            </div>
                        </div>
                        <video
                            autoPlay={true}
                            loop={true}
                            muted={true}
                            controls={false}
                            className="h-full object-cover rounded-2xl overflow-hidden"
                        >
                            <source src={PinguAnim} type="video/mp4" />
                        </video>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
