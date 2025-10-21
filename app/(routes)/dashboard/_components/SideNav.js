"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from "lucide-react";

function SideNav() {
  const pathname = usePathname();
  const { isSignedIn, user } = useUser();

  const menuList = [
    { id: 1, name: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
    { id: 2, name: "Budget", icon: PiggyBank, href: "/budget" },
    { id: 3, name: "Expenses", icon: ReceiptText, href: "/expenses" },
    { id: 4, name: "Upgrade", icon: ShieldCheck, href: "/upgrade" },
  ];

  return (
    <div className="h-screen p-5 border-r bg-white flex flex-col justify-between shadow-lg">
      {/* Top: Logo + Menu */}
      <div>
        {/* Logo */}
        <div className="mb-12 flex justify-center">
          <Image src="/logo.svg" alt="Logo" width={160} height={100} />
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col space-y-3">
          {menuList.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  flex items-center gap-3 p-3 rounded-xl font-medium transition-all
                  ${isActive
                    ? "bg-green-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-green-50 hover:text-green-700 hover:shadow-sm"}
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-green-600"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: User Info + UserButton */}
      {isSignedIn && user && (
        <div className="mt-10 flex items-center gap-3 p-3 bg-gray-50 rounded-xl shadow-inner">
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-12 h-12 rounded-full",
                userButtonRoot: "p-0",
              },
            }}
          />
          <div className="flex flex-col">
            <p className="font-semibold text-gray-800 truncate">
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
