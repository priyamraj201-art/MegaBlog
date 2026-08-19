import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo'

function Footer() {
  return (
    <footer className="w-full bg-[#FAF7EE] border-t border-[#E0DCD0] py-12 mt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-6 border-b border-[#E0DCD0]">
          {/* Brand Logo */}
          <div>
            <div className="font-display text-5xl sm:text-6xl font-black tracking-tighter text-[#121212] uppercase leading-none">
              MEGABLOG
            </div>
          </div>

          {/* Links & Copyright */}
          <div className="flex flex-col md:items-end gap-4">
            <ul className="flex flex-wrap gap-6 text-xs font-bold uppercase tracking-widest text-[#121212]">
              <li>
                <Link to="/" className="hover:text-[#666666] transition-colors">
                  MANIFESTO
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-[#666666] transition-colors">
                  PRIVACY
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-[#666666] transition-colors">
                  SUPPORT
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-[#666666] transition-colors">
                  CAREERS
                </Link>
              </li>
            </ul>

            <p className="text-[10px] font-semibold tracking-wider text-[#88857B] uppercase">
              &copy; {new Date().getFullYear()} MEGABLOG. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer