'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SignInButton, UserButton, SignedIn, SignedOut, SignOutButton } from '@clerk/nextjs';

const NavBar = () => {
  return (
    <> 
    <div className=' w-full py-4 flex items-center justify-between px-3  md:px-30 fixed'>
      <div className='flex items-center justify-between w-full'>
        <div className='text-teal-500 text-3xl font-bold'>Laitora <span className='text-gray-800'>Store</span></div>
      <SignedOut>
<Link href={'/contact'}>
<div className=' md:hidden  rounded text-teal-400  border-1 hover:bg-teal-400 hover:text-white hover:border-teal-400 duration-200  cursor-pointer py-[1.5] px-2 text-center '>Contact Us</div>
</Link>
        </SignedOut>
        </div>

      <div className='flex items-center gap-5'>
<Link href={'/contact'}>
<div className=' hidden md:block  rounded text-teal-400 md:w-34 border-1 hover:bg-teal-400 hover:text-white hover:border-teal-400 duration-200  cursor-pointer py-3 px-5 text-center'>Contact Us</div>

</Link>      
        <SignedIn>
         <div className='text-gray-700 md:w-34 hover:text-teal-700 hover:bg-amber-50 cursor-pointer font-semibold py-3 px-5 rounded  hidden md:block text-center '> <SignOutButton/></div>
        <div className='md:hidden'> <UserButton/></div>
        </SignedIn>
        
      </div>
    </div>
    </>
  );
};

export default NavBar;
