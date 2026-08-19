import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import authService from "./appwrite/auth"
import {login, logout} from "./store/authSlice"
import { Footer, Header } from './components'
import { Outlet } from 'react-router-dom'
import { missingVariables } from './conf/conf'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if (userData) {
        dispatch(login({userData}))
      } else {
        dispatch(logout())
      }
    })
    .finally(() => setLoading(false))
  }, [])
  
  return !loading ? (
    <div className='min-h-screen flex flex-col justify-between bg-[#FAF7EE] text-[#121212] font-sans antialiased'>
      {missingVariables.length > 0 && (
        <div className='bg-red-100 px-4 py-3 text-center text-sm font-semibold text-red-800'>
          App configuration is incomplete. Add these GitHub Actions secrets: {missingVariables.join(', ')}
        </div>
      )}
      <Header />
      <main className='flex-grow'>
        <Outlet />
      </main>
      <Footer />
    </div>
  ) : null
}

export default App
