import React, { useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { getInitials } from '../utilities/Helper'
import { useNavigate } from 'react-router-dom';

const Navbar = ({ userInfo }) => {

    const naviagte = useNavigate()

    const handleLogout = () => {
        naviagte("/login")
        localStorage.clear()
    }

    return (
        <div className='bg-white flex items-center justify-between px-6 py-2
        drop-shadow sticky top-0 z-10 '>
            <div className='mx-5 my-3 text-3xl font-semibold'>
                NOTE APP
            </div>

            <div className="flex items-center border rounded-md h-9 w-80 px-2 hover:border-primary">
                <input type="text"
                    placeholder="Search"
                    className="focus:outline-none text-lg w-full" />
                <CiSearch className='cursor-pointer text-2xl' />
            </div>

            <div className='flex items-center gap-3'>
                <div className='group relative'>
                    <div className='size-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100'>
                        {getInitials(userInfo)}
                    </div>
                    <div className='absolute -bottom-10 -right-4 hidden group-hover:flex transition-all duration-300 bg-primary w-20 h-7 items-center justify-center rounded-lg'>
                        <p>Profile</p>
                    </div>
                </div>

                <div>
                    <p className='text-sm font-medium'>{userInfo}</p>
                    <button className='text-sm text-slate-700 underline' onClick={handleLogout}>
                        Logout
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Navbar