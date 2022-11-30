import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../Footer'
import Navbar from '../Navbar'

const Layout = () => {
  return (
    <div className='flex flex-col justify-between h-screen'>
      <Navbar />

      <main className='flex-grow bg-yellow-500'>
        <Outlet />
      </main>

      <div >
      <Footer  />
      </div>

    </div>
  )
}

export default Layout