import React from 'react'
import Image from 'next/image'

function Hero() {
    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="mx-auto w-screen max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32 text-center">
                <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white">
                    Map Your Money
                    <strong className="text-green-600"> Master </strong>
                    Your Life
                </h1>

                <p className="mt-4 text-base text-gray-500 sm:text-lg/relaxed dark:text-gray-200">
                    MoneyMap helps you take control of your finances by tracking every expense, visualizing your spending,
                    and helping you make smarter money decisions effortlessly.
                </p>

                <div className="mt-4 flex justify-center gap-4 sm:mt-6">                    
                    <a
                        className="inline-block rounded border border-green-600 bg-green-600 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-green-700"
                        href="/"
                    >
                        Get Started
                    </a>
                    <a
                        className="inline-block rounded border border-gray-200 px-5 py-3 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
                        href="#"
                    >
                        Learn More
                    </a>
                </div>
            </div>

            {/* Image Section */}
            <div className="flex justify-center px-4 pb-16 sm:pb-24 lg:pb-32">
                <Image
                    src="/dashboard.png"
                    alt="Dashboard Image"
                    width={1000}
                    height={600}
                    className="w-full h-auto"
                />
            </div>
        </section>
    )
}

export default Hero
