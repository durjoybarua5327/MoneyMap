import React from 'react'
import Header from '../_components/Header'
import Hero from '../_components/Hero'
import { SignIn } from '@clerk/nextjs'
import SignInPage from '../(auth)/sign-in/[[...sign-in]]/page'

function page() {
  return (
    <div>
        <SignInPage/>
    </div>
  )
}

export default page

