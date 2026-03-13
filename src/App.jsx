import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'
import PopUpBanner from './pages/popupbanner/PopUpBanner'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <PopUpBanner/>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </>
  )
}

export default App
