"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { IoMenu } from "react-icons/io5";
import { FiX } from "react-icons/fi";



const Nav = () => {
    const isUserLoggedIn = false;


    const [toggleDropdown, setToggleDropdown] = useState(false);



    return (
        <div className="w-full bg-blue-200">
            <nav className='flex justify-between w-4/5 m-auto p-4 relative'>
                <Link href='/' className='flex items-center gap-2 flex-center'>
                    <Image
                        src='/vercel.svg'
                        alt='logo'
                        width={110}
                        height={110}
                        className='object-contain'
                    />

                </Link>

                {/* Desktop Navigation */}

                <div className='sm:flex hidden gap-3 md:gap-5'>
                    <div className='flex gap-3 md:gap-5'>
                        <Link href='/' className='outline_btn'>
                            Home
                        </Link>

                        <Link href='/schedule' className='outline_btn'>
                            schedule
                        </Link>

                    </div>

                    {isUserLoggedIn ? (
                        <div className='flex gap-3 md:gap-5'>
                            <button type='button' className='black_btn'>
                                Sign Out
                            </button>

                            <Link href='/profile' className="flex items-center" >
                                <Image
                                    src="/profile.avif"
                                    width={37}
                                    height={37}
                                    className='rounded-full'
                                    alt='profile'
                                />
                            </Link>
                        </div>

                    ) : (
                        <div className='flex gap-3 md:gap-5'>

                            <button
                                type='button'
                                className='black_btn'>
                                Sign in
                            </button>

                        </div>
                    )}

                </div>

                {/* Mobile  */}

                <div className='sm:hidden flex'>

                    <div className="text-3xl" onClick={() => setToggleDropdown(!toggleDropdown)}>
                        {toggleDropdown ? <FiX /> : <IoMenu />}
                    </div>

                    {toggleDropdown && (
                        <div className='dropdown'>
                            <Link href='/' className='dropdown_link' onClick={() => setToggleDropdown(false)}>
                                Home
                            </Link>

                            <Link href='/schedule' className='dropdown_link' onClick={() => setToggleDropdown(false)}>
                                Schedule
                            </Link>

                            {isUserLoggedIn ? (
                                <>
                                    <Link href='/profile' className='dropdown_link' onClick={() => setToggleDropdown(false)}>
                                        My Profile
                                    </Link>

                                    <button
                                        type='button'
                                        onClick={() => setToggleDropdown(false)}
                                        className='black_btn w-full mt-5'>
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <button type='button' className='black_btn w-full mt-5'>
                                    Sign in
                                </button>
                            )}
                        </div>
                    )}
                </div>

            </nav >
        </div >
    );
};

export default Nav;