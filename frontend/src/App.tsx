import './App.css'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './Pages/Dashboard/Dashboard'
import Pong from './Pages/Pong/Pong'
import Chat from './Pages/Chat/Chat'
import Profile from './Pages/Profile/Profile'
import Layout from './components/Layout'
import Auth from './Pages/Auth/Auth'
import ProtectedRoute from './components/ProtectedRoute'
import { WebSocketProvider } from './context/webSocketContext'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import TwoFA from "./Pages/TwoFA/TwoFA";
import { TwoFAProvider } from "./context/twoFAEnableContext";

const queryClient = new QueryClient()

function App() {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Routes>
                    <Route path="/auth" element={<Auth />}></Route>
                    <Route element={<ProtectedRoute />}>
                        <Route element={<WebSocketProvider />}>
                        <Route element={<TwoFAProvider />}>
                            <Route element={<Layout />}>
                                <Route
                                    index
                                    path="/"
                                    element={<Dashboard />}
                                ></Route>
                                <Route path="/pong" element={<Pong />}></Route>
                                <Route path="/chat" element={<Chat />}></Route>
                                <Route
                                    path="/profile"
                                    element={<Profile />}
                                ></Route>
                            </Route>
                        </Route>
                        </Route>
                    </Route>
                </Routes>
            </QueryClientProvider>
        </>
    )
}

export default App
