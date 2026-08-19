import React from 'react'
import { Container, Logo, LogoutBtn } from '../index'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const userData = useSelector((state) => state.auth.userData)
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    {
      name: 'Discover',
      slug: '/',
      active: true,
    },
    {
      name: 'All Posts',
      slug: '/all-posts',
      active: true,
      highlight: true,
    },
    {
      name: 'Add Post',
      slug: '/add-post',
      active: authStatus,
    },
  ]

  const authNavItems = [
    {
      name: 'Login',
      slug: '/login',
      active: !authStatus,
    },
    {
      name: 'Signup',
      slug: '/signup',
      active: !authStatus,
    },
  ]

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7EE]/90 backdrop-blur-md border-b border-[#E8E4D8] py-4 transition-all">
      <Container>
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="group flex items-center gap-1">
              <Logo />
            </Link>
          </div>

          {/* Navigation Links */}
          <ul className="hidden md:flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider text-[#4A4A4A]">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name} className="relative py-1">
                  <button
                    onClick={() => navigate(item.slug)}
                    className={`transition-colors duration-150 hover:text-[#121212] ${
                      location.pathname === item.slug
                        ? 'text-[#121212] font-bold'
                        : ''
                    }`}
                  >
                    {item.name}
                  </button>
                  {item.highlight && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B5FF00]" />
                  )}
                </li>
              ) : null
            )}
            <li className="py-1 hover:text-[#121212] cursor-pointer transition-colors">Creators</li>
            <li className="py-1 hover:text-[#121212] cursor-pointer transition-colors">About</li>
          </ul>

          {/* User Actions & Auth */}
          <div className="flex items-center space-x-4">
            {authNavItems.map((item) =>
              item.active ? (
                <button
                  key={item.name}
                  onClick={() => navigate(item.slug)}
                  className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all ${
                    item.name === 'Signup'
                      ? 'bg-[#B5FF00] hover:bg-[#a3e600] text-black shadow-sm'
                      : 'hover:bg-[#EFECE1] text-[#121212]'
                  }`}
                >
                  {item.name}
                </button>
              ) : null
            )}

            {authStatus && (
              <div className="flex items-center space-x-3">
                {/* Notification Bell */}
                <button
                  aria-label="Notifications"
                  className="p-2 rounded-full hover:bg-[#EFECE1] text-[#121212] transition-colors relative"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#B5FF00] rounded-full ring-2 ring-[#FAF7EE]" />
                </button>

                {/* Profile Avatar / Logout */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#121212] text-[#B5FF00] font-bold flex items-center justify-center text-xs uppercase border border-[#B5FF00]">
                    {userData?.name ? userData.name.charAt(0) : 'U'}
                  </div>
                  <LogoutBtn />
                </div>
              </div>
            )}
          </div>
        </nav>
      </Container>
    </header>
  )
}

export default Header