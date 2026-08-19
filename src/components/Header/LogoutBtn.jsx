import React from 'react'
import {useDispatch} from 'react-redux'
import authService from '../../appwrite/auth'
import {logout} from '../../store/authSlice'

function LogoutBtn() {
    const dispatch = useDispatch()
    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout())
        })
    }
  return (
    <button
      className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-[#121212] text-[#121212] hover:bg-[#121212] hover:text-[#B5FF00] transition-all duration-200"
      onClick={logoutHandler}
    >
      Logout
    </button>
  )
}

export default LogoutBtn