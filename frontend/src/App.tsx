import './App.css'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './Pages/Dashboard/Dashboard'
import Chat from './Pages/Chat/ChatPage'
// import { Button } from "@/components/ui/button"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard/>}> </Route>
		<Route path="/chat" element={<Chat/>} ></Route>
      </Routes>
    </>
  )
}

export default App
