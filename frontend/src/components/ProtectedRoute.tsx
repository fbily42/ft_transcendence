import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import instance from '@/axiosConfig'
import { useQuery } from '@tanstack/react-query'
import { getUserMe } from '@/lib/Dashboard/dashboard.requests'

function ProtectedRoute(): JSX.Element {
    const navigate = useNavigate()
    const location = useLocation()
    const [auth, setAuth] = useState<boolean>(false)

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
                const { data: me } = useQuery({
                    queryKey: ['me'],
                    queryFn: getUserMe,
                })
                if (!me?.avatar || !me?.pseudo) navigate('/auth')
            } catch (error) {
                setAuth(false)
                navigate('/auth')
            }
        }
        checkIsAuth()
    }, [location.pathname])

    if (auth) {
        return <Outlet></Outlet>
    }
    return <div></div>
}

export default ProtectedRoute
