import React from 'react'
import { Outlet } from 'react-router-dom'
import Logo from "../../assets/colored_logo.svg"
import BgImage from '../../assets/auth_bg.avif'

const AuthLayout = () => {
  return (
    <div className='flex min-h-screen'>
    
        <div className='w-[100%] lg:w-1/2'>
            <nav className='shadow-sm shadow-slate-300 h-20 flex items-center pl-8'>
                <div className=''>
                    <img src={Logo}  className="w-32 h-16 "  alt="logo"/>
                </div>
            </nav>
         <div className='p-8 '>

        <Outlet/>
         </div>
        </div>
        <div className="hidden lg:block w-1/2 bg-center bg-cover bg-no-repeat   bg-blue-900" style={{backgroundImage: `url(${BgImage})`}}>
           {/* <img src={BgImage} alt='workers' /> */}
        </div>
    </div>
  )
}

export default AuthLayout