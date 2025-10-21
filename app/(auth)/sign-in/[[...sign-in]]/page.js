

import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-100 to-green-300">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src="/logo.svg" alt="MoneyMap Logo" width={100} height={100} />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
          Welcome Back!
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Sign in to track your expenses and manage your finances effortlessly
        </p>

        {/* SignIn Form (Clerk) */}
        <div className="mt-4">
          <SignIn
            appearance={{
              variables: {
                colorPrimary: "#16a34a", // green
                colorText: "#111827",
                fontFamily: "Inter, sans-serif",
              },
              elements: {
                formButtonPrimary: "bg-green-600 hover:bg-green-700 rounded-full py-2",
              },
            }}
          />
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 dark:text-gray-400 mt-6 text-sm">
          Don’t have an account?{" "}
          <a
            href="/sign-up"
            className="text-green-600 font-medium hover:underline"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
