"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from "lucide-react";

function SideNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn, user } = useUser();

  const menuList = [
    { name: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
    { name: "Budget", icon: PiggyBank, path: "/dashboard/budgets" },
    { name: "Expenses", icon: ReceiptText, path: "/dashboard/expenses" },
    { name: "Upgrade", icon: ShieldCheck, path: "/dashboard/upgrade" },
  ];

  return (
    <div className="h-screen p-5 flex flex-col justify-between shadow-md">
      <div>
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <Image src="/logo.svg" alt="Logo" width={160} height={100} priority />
        </div>

        {/* Menu List */}
        <div>
          {menuList.map((menu) => {
            const isActive = pathname === menu.path;
            return (
              <div
                key={menu.name}
                onClick={() => router.push(menu.path)}
                className={`flex items-center gap-3 p-3 mb-2 rounded-lg cursor-pointer transition
                  ${
                    isActive
                      ? "bg-green-300 text-green-900"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                  }`}
              >
                <menu.icon className="w-5 h-5" />
                <span className="font-medium">{menu.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Section */}
      {isSignedIn && user && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl shadow-inner">
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-10 h-10 rounded-full",
                userButtonRoot: "p-0",
              },
            }}
          />
          <div>
            <p className="font-semibold text-gray-800">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {user.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SideNav;
