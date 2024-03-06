import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import Login from '@/components/Auth/Login'

function Auth(): JSX.Element {
    const [isAuth, setIsAuth] = useState<boolean>(false)
    const [isProfileSet, setIsProfileSet] = useState<boolean>(false)

    useEffect(() => {
        async function checkIsAuth(): Promise<void> {``
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/auth/isProfileSet`,
                    {
                        withCredentials: true,
                    }
                )
                setIsAuth(true)
                setIsProfileSet(true)
            } catch (error) {
                if (error.response.status == 401) {
                    setIsProfileSet(false)
                    setIsAuth(true)
                } else {
                    setIsProfileSet(false)
                    setIsAuth(false)
                }
            }
        }

        checkIsAuth()
    }, [])

    const onProfileSet = () => setIsProfileSet(true)

    if (isAuth && isProfileSet) {
        return <Navigate to="/" />
    } else {
        return (
            <Login isAuth={isAuth}>
                <Outlet></Outlet>
            </Login>
        )
    }
}

export default Auth
