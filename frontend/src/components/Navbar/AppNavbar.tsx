import React, { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import {
    Gamepad2,
    Home,
    MessageCircle,
    LogOut,
    CircleUserRound,
} from 'lucide-react'
import axios from 'axios'
import GameForm from '../Pong/GameForm'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import pingu_duo from './../../assets/Pong_page/duo.png'

const VerticalNavbar: React.FC = () => {
    const [active, setActive] = useState<number>(0)
    const location = useLocation()
	const [open, setOpen] = useState(false);

    // Update active state when the route changes
    useEffect(() => {
        const path = location.pathname
        switch (path) {
            case '/':
                setActive(1)
                break
            case '/pong':
				// setOpen(true)
                setActive(2)
                break
            case '/chat':
                setActive(3)
                break
            case '/profile':
                setActive(4)
                break
            case '/auth':
                setActive(5)
                break
            default:
                setActive(1)
        }
    }, [location.pathname])

    // Update local storage when the active state changes
    useEffect(() => {
        localStorage.setItem('activeButton', String(active))
    }, [active])

    useEffect(() => {
        // Retrieve the last active button from local storage only if not already set by the route
        const storedActiveButton = localStorage.getItem('activeButton')
        if (storedActiveButton && active !== Number(storedActiveButton)) {
            setActive(Number(storedActiveButton))
        }
    }, [active])

    const handleNavTabs = (btnId: number) => {
        if (active !== btnId) setActive(btnId)
    }

    const navigate = useNavigate()
    const handleLogout = async () => {
        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/auth/logout`,
                {},
                {
                    withCredentials: true,
                }
            )
            navigate('/auth')
        } catch (error) {
            console.log('Error getdata', error)
        }
    }

	const closeDialog = () => {
		//faire un emit pour retirer la personne de la map du matchmaking car cela veut dire qu'elle a ferme la page, mais uniquement si elle a ferme la modal avant que la game commence 
		setOpen(false);
	  };
    return (
        <nav className="fixed bg-white shadow-drop h-screen w-[86px] flex flex-col justify-center pl-[18px] py-[36px]">
            <div className="flex flex-col justify-between h-full">
                <Link
                    to="/"
                    className="text-black font-bold text-lg"
                    onClick={() => handleNavTabs(1)}
                >
                    Pingu
                </Link>
                <div className="flex flex-col items-start gap-[33px]">
                    <Link to="/" className="text-black">
                        <Button
                            variant={
                                active === 1 ? 'tabBtnActive' : 'tabBtnDefault'
                            }
                            size="openedTabSize"
                            onClick={() => handleNavTabs(1)}
                        >
                            <div
                                className={`pr-[20px] ${
                                    active === 1 ? 'text-white' : 'text-black'
                                }`}
                            >
                                <Home className="h-[24px] w-[24px]" />
                            </div>
                        </Button>
                    </Link>
                    {/* <Link className="text-black"> */}
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant={
                                    active === 2
                                        ? 'gameBtnActive'
                                        : 'gameBtnDefault'
                                }
                                size="icon"
                                onClick={() => handleNavTabs(2)}
                            >
                                <div
                                    className={`${
                                        active === 2
                                            ? 'text-white'
                                            : 'text-black'
                                    }`}
                                >
                                    <Gamepad2 className="h-[24px] w-[24px]" />
                                </div>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <GameForm closeDialog={closeDialog}></GameForm>
                        </DialogContent>
                    </Dialog>
                    <Link to="/chat" className="text-black">
                        <Button
                            variant={
                                active === 3 ? 'tabBtnActive' : 'tabBtnDefault'
                            }
                            size="openedTabSize"
                            onClick={() => handleNavTabs(3)}
                        >
                            <div
                                className={`pr-[20px] ${
                                    active === 3 ? 'text-white' : 'text-black'
                                }`}
                            >
                                <MessageCircle className="h-[24px] w-[24px]" />
                            </div>
                        </Button>
                    </Link>
                </div>
                <div className="flex flex-col items-start gap-[13px]">
                    <Link to="/profile" className="text-black">
                        <Button
                            variant={
                                active === 4 ? 'tabBtnActive' : 'tabBtnDefault'
                            }
                            size="openedTabSize"
                            onClick={() => handleNavTabs(4)}
                        >
                            <div
                                className={`pr-[20px] ${
                                    active === 4 ? 'text-white' : 'text-black'
                                }`}
                            >
                                <CircleUserRound className="h-[24px] w-[24px]" />
                            </div>
                        </Button>
                    </Link>
                    <Button
                        variant={
                            active === 5 ? 'tabBtnActive' : 'tabBtnDefault'
                        }
                        size="openedTabSize"
                        onClick={handleLogout}
                    >
                        <div
                            className={`pr-[20px] ${
                                active === 5 ? 'text-white' : 'text-black'
                            }`}
                        >
                            <LogOut className="h-[24px] w-[24px]" />
                        </div>
                    </Button>
                </div>
            </div>
        </nav>
    )
}

export default VerticalNavbar
