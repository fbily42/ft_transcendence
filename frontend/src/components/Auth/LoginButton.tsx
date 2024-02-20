import { Link } from 'react-router-dom'
import { Button } from '../ui/button'

type LoginButtonprops = {
    children: React.ReactNode
}

const LoginButton: React.FC<LoginButtonprops> = ({ children }) => {
    return (
        <div>
            <div className="flex flex-col gap-y-[10px] justify-center text-center">
                <div>
                    <p className="text-5xl font-bold">
                        WELCOME TO PINGUCENDENCE
                    </p>
                </div>
                <div>
                    <p className="text-2xl">
                        Login to visit Pingu and his family in Antarctica
                    </p>
                </div>
            </div>
            <div className="w-full h-full flex justify-center items-center">
                <Link to={import.meta.env.VITE_REDIRECT_URI}>
                    <Button className="bg-customYellow text-xl font-semibold">
                        Login as 42 Student
                    </Button>
                </Link>
                {children}
            </div>
        </div>
    )
}

export default LoginButton
