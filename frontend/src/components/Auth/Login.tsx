import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

type Loginprops = {
	children : React.ReactNode
}

const Login : React.FC<Loginprops> = ({children}) => {
	return (
	<div className='w-full h-[100vh] flex justify-center items-center'>
		<Link to={import.meta.env.VITE_REDIRECT_URI}>
			<Button variant='destructive'>Login 42</Button>
		</Link>
		{children}
	</div>
	);
}

export default Login;