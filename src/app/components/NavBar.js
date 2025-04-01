'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SignInButton, UserButton, SignedIn, SignedOut, SignOutButton } from '@clerk/nextjs';

const NavBar = () => {
  return (
    <>
    <div className=' w-full p-4 flex items-center justify-between px-5 md:px-30 fixed'>
      <div className='text-teal-500 text-3xl font-bold'>Laitora <span className='text-gray-800'>Store</span></div>
      <div className='flex items-center gap-5'>
        <div className='text-xl text-gray-700 font-semibold hover:underline  duration-200 hidden md:block '>Contact us</div>
        <SignedIn>
         <div className='text-gray-700 hover:text-teal-700 hover:bg-amber-50 cursor-pointer font-semibold py-2 px-4 rounded-2xl hidden md:block '> <SignOutButton/></div>
        <div className='md:hidden'> <UserButton/></div>
        </SignedIn>
      </div>
    </div>
    </>
  );
};

export default NavBar;
