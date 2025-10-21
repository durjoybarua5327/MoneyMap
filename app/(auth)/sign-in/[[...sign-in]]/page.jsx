"use client";

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-400 via-blue-500 to-indigo-600 p-6">
      <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-8 max-w-md w-full border border-white/30">
        <h1 className="text-3xl font-bold text-white text-center mb-4">
          Welcome Back 👋
        </h1>
        <p className="text-white/80 text-center mb-8">
          Sign in to continue exploring
        </p>

        <div className="flex justify-center">
          <SignIn
            routing="path"
            path="/sign-in"
            forceRedirectUrl="/dashboard"
            signUpUrl="/sign-up"
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-green-600 hover:bg-green-700 text-white font-semibold",
                card: "bg-transparent shadow-none",
                headerTitle: "text-white",
                headerSubtitle: "text-white/70",
                footerActionText: "text-white/70",
                footerActionLink: "text-green-300 hover:text-green-200",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
