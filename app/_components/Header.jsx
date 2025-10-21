import React from 'react'
import Image from 'next/image'


function Header() {
    return (
        <div className='p-5 flex justify-between items-center border shadow-sm'>
            <Image src="/logo.svg" alt="Logo" width={150} height={150} />

                <button className="inline-block rounded-full border border-green-600 bg-green-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700">
                    Get Started
                </button>
        </div>
    )
}

export default Header

