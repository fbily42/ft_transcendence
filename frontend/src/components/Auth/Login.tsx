import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import PinguLogo from '../../assets/welcome-assets/PinguLogo.svg'
import PinguFamily from '../../assets/welcome-assets/PinguFamily.svg'


type Loginprops = {
	children : React.ReactNode
}

const Login : React.FC<Loginprops> = ({children}) => {
	return (
		<div className='flex h-[100vh]'>
			<div className='flex-1 flex flex-col justify-between items-center bg-blue-300 p-[36px]'>
				<div className='bg-red-500'>
					<img src={PinguLogo}></img>
				</div>
				<div className="flex flex-col gap-y-[36px] items-center bg-red-400">
					<div className='flex flex-col gap-y-[10px] justify-center text-center bg-pink-400'>
						<div>
							<p className='text-5xl font-bold'>WELCOME TO PINGUSCENDENCE</p>
						</div>
						<div>
							<p className='text-xl'>Login to visit Pingu and his family in Antarctica</p>
						</div>
					</div>
					<div className='w-full h-full flex justify-center items-center bg-pink-400'>
						<Link to={import.meta.env.VITE_REDIRECT_URI}>
							<Button className='bg-customYellow text-lg font-bold' >Login as 42 Student</Button>
						</Link>
						{children}
					</div>
				</div>
				<div className='bg-red-300'>
					<img src={PinguFamily}></img>
				</div>
			</div>
			<div className='hidden lg:flex lg:flex-1 bg-green-300 p-[36px]'>
				Div 2
			</div>
		</div>
	);
}

export default Login;