import React from 'react'
import Logo from '../assets/colored_logo.svg'

const Navbar = () => {
  return (
    <nav className='shadow-sm shadow-slate-300 h-20 flex items-center pl-8'>
    <div className=''>
        <img src={Logo}  className="w-32 h-16 "  alt="logo"/>
    </div>
</nav>
  )
}

export default Navbar