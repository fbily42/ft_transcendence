import './App.css'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './Pages/Dashboard/Dashboard'
// import { Button } from "@/components/ui/button"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard/>}>
    
        </Route>
      </Routes>
    </>
  )
}

export default App
