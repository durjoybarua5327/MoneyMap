import React from 'react'
import { UserButton } from '@clerk/nextjs'


function DashBoardHeader() {
  return (
    <div className='p-6 shadow-sm border-b flex justify-between items-center'>
      <div>
        Dashboard header
      </div>
      <div >
        <UserButton />
      </div>
    </div>
  )
}

export default DashBoardHeader
