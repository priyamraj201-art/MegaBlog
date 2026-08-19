import React from 'react'

function Logo({ width = '100px', className = '' }) {
  return (
    <div className={`font-display text-4xl sm:text-5xl font-black tracking-tighter text-[#121212] leading-none uppercase select-none ${className}`}>
      MEGABLOG
    </div>
  )
}

export default Logo