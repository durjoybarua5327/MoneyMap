'use client';
import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';

function BudgetItem({ budget, expenses = [] }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/expenses?budgetId=${budget.id}`);
  };

  // Memoize calculations so they update when expenses or budget change
  const { budgetExpenses, totalExpense, totalItems, remaining, progress } = useMemo(() => {
    const budgetExpenses = expenses.filter(exp => exp.budgetId === budget.id);
    const totalExpense = budgetExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const totalItems = budgetExpenses.length;
    const remaining = parseFloat(budget.amount) - totalExpense;
    const progress = Math.min((totalExpense / budget.amount) * 100, 100);

    return { budgetExpenses, totalExpense, totalItems, remaining, progress };
  }, [expenses, budget]);

  return (
    <div
      className='bg-white p-4 rounded-md shadow-md cursor-pointer 
                 hover:bg-green-100 hover:scale-105 active:scale-95 
                 transform transition-all duration-200'
      onClick={handleClick}
    >
      <div className='flex justify-between items-center'>
        <div className='text-3xl'>{budget.icon || '💰'}</div>
        <div className='text-lg font-bold'>${parseFloat(budget.amount).toFixed(2)}</div>
      </div>

      <h3 className='font-bold text-lg mt-2'>{budget.name}</h3>
      <p className='text-sm text-gray-500'>{totalItems} Items</p>

      <div className='flex justify-between mt-2 text-sm'>
        <span>${totalExpense.toFixed(2)} Spent</span>
        <span>${remaining.toFixed(2)} Remaining</span>
      </div>

      <div className='bg-gray-200 h-2 rounded-full mt-2'>
        <div
          className='bg-green-400 h-2 rounded-full transition-all duration-300'
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default BudgetItem;
