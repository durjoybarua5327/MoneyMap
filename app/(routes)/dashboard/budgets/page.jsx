import React from 'react'
import BudgetList from './_components/BudgetList'

function page() {
  return (
    <div className='p-8'>
      <h2 className='font-bold text-3xl text-green-400'>My Budgets </h2>
      
      <BudgetList/>
    </div>
  )
}

export default page

