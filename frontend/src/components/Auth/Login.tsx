import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

type Loginprops = {
	children : React.ReactNode
}

const Login : React.FC<Loginprops> = ({children}) => {
	return (
		<div className='flex h-[100vh]'>
			<div className='flex-1 bg-blue-300 p-4'>
				<div>
					Image Pingu
				</div>
				<div>
					Middle text
					<div className='w-full h-full flex justify-center items-center'>
						<Link to={import.meta.env.VITE_REDIRECT_URI}>
							<Button className='bg-customYellow font-bold' >Login as 42 Student</Button>
						</Link>
						{children}
					</div>
				</div>
				<div>
					Footer image
				</div>
				<div>
					Snow
				</div>
			</div>
			<div className='hidden lg:flex lg:flex-1 bg-green-300 p-4'>
				Div 2
			</div>
		</div>
	);
}

export default Login;