"use client";

import React, { useState } from "react";
import SideNav from "./_components/SideNav";
import DashBoardHeader from "./_components/DashBoardHeader";

function DashboardLayout() {
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");

  return (
    <div className="flex min-h-screen p-4">
      <div className="w-[20%] fixed h-screen border-r">
        <SideNav
          selectedMenu={selectedMenu}
          onSelectMenu={setSelectedMenu}
        />
      </div>

      <div className="ml-[21%] w-[90%] p-4 min-h-screen">
        <DashBoardHeader />
        <div className="mt-6">
          <h1 className="text-3xl font-bold">{selectedMenu}</h1>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
