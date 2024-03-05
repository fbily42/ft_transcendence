import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import instance from '@/axiosConfig'
import { useQuery } from '@tanstack/react-query'
import { getUserMe } from '@/lib/Dashboard/dashboard.requests'

function ProtectedRoute(): JSX.Element {
    const navigate = useNavigate()
    const location = useLocation()
    const [auth, setAuth] = useState<boolean>(false)
    const {
        data: me,
        isSuccess,
    } = useQuery({
        queryKey: ['me'],
        queryFn: getUserMe,
    })

    useEffect(() => {
        async function checkIsAuth(): Promise<void> {
            try {
                const response = await instance.get(
                    `${import.meta.env.VITE_BACKEND_URL}/auth/isAuth`,
                    {
                        withCredentials: true,
                    }
                )
                setAuth(true)
                if (isSuccess) {
                    if (!me?.avatar || !me?.pseudo) throw new Error()
                }
            } catch (error) {
                setAuth(false)
                navigate('/auth')
            }
        }
        checkIsAuth()
    }, [location.pathname, isSuccess])

    if (auth) {
        return <Outlet></Outlet>
    }
    return <div></div>
}

export default ProtectedRoute
