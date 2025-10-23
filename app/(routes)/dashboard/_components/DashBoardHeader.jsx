import React from 'react';
import { UserButton } from '@clerk/nextjs';

function DashBoardHeader() {
  return (
    <header className="w-full bg-gradient-to-r from-green-200 to-green-400 shadow-md p-6 rounded-b-lg flex justify-between items-center">
      
      {/* Left side: Logo or Title */}
      <div className="flex items-center space-x-3">
        <div className="bg-white text-green-500 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold shadow-sm">
          💰
        </div>
        <h1 className="text-green-800 text-2xl font-semibold tracking-wide">
          Dashboard
        </h1>
      </div>
      
      {/* Right side: User */}
      <div className="flex items-center space-x-4">
        <span className="text-green-900 font-medium hidden md:inline">
          Welcome Back!
        </span>
        <div className="rounded-full border-2 border-green-300 p-0.5 hover:scale-105 transition-transform">
          <UserButton />
        </div>
      </div>
    </header>
  );
}

export default DashBoardHeader;
