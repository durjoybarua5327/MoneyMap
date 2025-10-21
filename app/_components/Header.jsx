"use client";

import React from "react";
import Image from "next/image";
import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function Header() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  const handleGetStarted = () => {
    // Redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="p-5 flex justify-between items-center border shadow-sm">
      <Image src="/logo.svg" alt="Logo" width={150} height={150} />
      {isSignedIn ? (
        <UserButton />
      ) : (
        <button
          onClick={handleGetStarted}
          className="inline-block rounded-full border border-green-600 bg-green-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700"
        >
          Get Started
        </button>
      )}
    </div>
  );
}

export default Header;
