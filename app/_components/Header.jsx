import React from 'react'
import Image from 'next/image'


function Header() {
  return (
    <div className='p-5'>
      <Image src="/logo.svg" alt="Logo" width={150} height={150} />
    </div>
  )
}




export default Header
