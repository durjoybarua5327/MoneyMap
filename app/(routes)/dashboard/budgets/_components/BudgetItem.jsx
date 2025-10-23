'use client';
import React from 'react';

function BudgetItem({ budget, totalExpense, onClick }) {
  const remaining = parseFloat(budget.amount) - totalExpense;
  const progress = Math.min((totalExpense / budget.amount) * 100, 100);

  return (
    <div
      className='bg-white p-4 rounded-md shadow-md cursor-pointer 
                 hover:bg-green-100 hover:scale-105 active:scale-95 
                 transform transition-all duration-200'
      onClick={onClick}
    >
      <div className='flex justify-between items-center'>
        <div className='text-3xl'>{budget.icon || '💰'}</div>
        <div className='text-lg font-bold'>${budget.amount}</div>
      </div>

      <h3 className='font-bold text-lg mt-2'>{budget.name}</h3>
      <p className='text-sm text-gray-500'>{budget.items || 0} Items</p>

      <div className='flex justify-between mt-2 text-sm'>
        <span>${totalExpense.toFixed(2)} Spent</span>
        <span>${remaining.toFixed(2)} Remaining</span>
      </div>

      <div className='bg-gray-200 h-2 rounded-full mt-2'>
        <div
          className='bg-green-400 h-2 rounded-full'
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default BudgetItem;
