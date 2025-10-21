"use client"; // Ensure this runs on the client if using client hooks

import React from "react";
import SideNav from "./_components/SideNav";

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <div className="w-[20%] fixed h-screen border-r">
        <SideNav />
      </div>

      {/* Right Main Content: 70% width */}
      <div className="ml-[21%] w-[90%] p-6  min-h-screen">
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
