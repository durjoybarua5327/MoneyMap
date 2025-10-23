"use client";

import React from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from "lucide-react";

function SideNav({ onSelectMenu, selectedMenu }) {
  const { isSignedIn, user } = useUser();

  const menuList = [
    { id: 1, name: "Dashboard", icon: LayoutGrid, key: "Dashboard" },
    { id: 2, name: "Budget", icon: PiggyBank, key: "Budget" },
    { id: 3, name: "Expenses", icon: ReceiptText, key: "Expenses" },
    { id: 4, name: "Upgrade", icon: ShieldCheck, key: "Upgrade" },
  ];

  return (
    <div className="h-screen p-5 border-r bg-white flex flex-col justify-between shadow-lg">
      <div>
        <div className="mb-10 flex justify-center">
          <Image src="/logo.svg" alt="Logo" width={160} height={100} priority />
        </div>
        <div>
          {menuList.map((menu) => (
            <div
              key={menu.id}
              onClick={() => onSelectMenu(menu.key)}
              className={`flex gap-2 items-center p-3 mb-2 rounded-lg cursor-pointer 
                          text-green-800 bg-green-200 hover:bg-green-400 transition
                          sm:text-sm md:text-base
                          ${selectedMenu === menu.key ? "text-green-900 bg-green-500" : ""}`}
            >
              <menu.icon className="w-5 h-5" />
              {menu.name}
            </div>
          ))}
        </div>
      </div>

      {isSignedIn && user && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl shadow-inner mb-4 sm:mb-6 md:mb-8">
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-12 h-12 rounded-full",
                userButtonRoot: "p-0",
              },
            }}
          />
          <div className="flex flex-col">
            <p className="font-semibold text-gray-800 truncate text-sm md:text-base">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs md:text-sm text-gray-500 truncate">
              {user.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SideNav;
