'use client'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const Dashboard = () => {
  return (
    <div className="p-8">
      <SignedIn>
        <h1 className="text-3xl font-bold">Welcome to your Dashboard !</h1>
        <p className="mt-4 text-teal-400">You are logged in and can now access your personalized content.</p>
       <div className='text-purple-500'> <UserButton showName /></div>
      </SignedIn>

      <SignedOut>
        <h1 className="text-xl text-orange-600">You need to be signed in to access the Dashboard</h1>
      </SignedOut>
    </div>
  );
};

export default Dashboard;
