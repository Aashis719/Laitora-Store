'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SignInButton, UserButton, SignedIn, SignedOut, SignOutButton } from '@clerk/nextjs';

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-300 to-yellow-200 min-h-screen flex items-center justify-center text-center p-5 md:p-10 ">
        <div className="max-w-3xl">
          <h1 className="text-4xl/normal md:5xl  font-bold text-gray-900 drop-shadow-lg">Delicious Treats, Delivered to Your Doorstep!</h1>
          <p className="mt-4 text-lg text-gray-700">Explore our wide range of bakery and sweet products, drinks, freshly made just for you.</p>
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/store" className="bg-teal-500 text-white px-6 py-3 rounded-xl text-lg shadow-md hover:bg-teal-600 transition-all">Explore Store</Link>
            <SignedOut>
              <div className=" bg-white/80 text-teal-600 px-6 py-3 rounded-xl text-lg shadow-md cursor-pointer hover:bg-gray-100 transition-all">
                <SignInButton/>
              </div>
            </SignedOut>
            
          </div>
            
        </div>
      </section>

      
     
    
    </>
  );
};

export default HomePage;
