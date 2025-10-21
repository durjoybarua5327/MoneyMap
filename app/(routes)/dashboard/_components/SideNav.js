"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from "lucide-react";

function SideNav() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  const menuList = [
    { id: 1, name: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
    { id: 2, name: "Budget", icon: PiggyBank, href: "/budget" },
    { id: 3, name: "Expenses", icon: ReceiptText, href: "/expenses" },
    { id: 4, name: "Settings", icon: ShieldCheck, href: "/settings" },
  ];

  return (
    <div className="h-screen p-5 border-r bg-white flex flex-col justify-between">
      {/* Top: Logo + Menu */}
      <div>
        <div className="mb-10">
          <Image src="/logo.svg" alt="Logo" width={160} height={100} />
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col space-y-2">
          {menuList.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  flex items-center gap-3 p-3 rounded-lg font-medium transition-colors
                  ${isActive ? "bg-green-600 text-white" : "text-gray-700 hover:bg-gray-100"}
                `}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: UserButton */}
      {isSignedIn && (
        <div className="mt-10">
          <UserButton />
        </div>
      )}
    </div>
  );
}

export default SideNav;
