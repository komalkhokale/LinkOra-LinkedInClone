import Navbar from '@/components/Navbar'
import React from 'react'

function UserLayout({children}) {
  return (
    <div>
        <Navbar />
        {children}
    </div>
  )
}

export default UserLayout