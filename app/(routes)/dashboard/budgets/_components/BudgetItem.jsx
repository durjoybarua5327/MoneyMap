'use client';
import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';

function BudgetItem({ budget, expenses = [] }) {
  const router = useRouter();

  const handleClick = () => {
    if (!budget) return;
    router.push(`/dashboard/expenses?budgetId=${budget.id}`);
  };

  const { totalExpense, totalItems, remaining, progress } = useMemo(() => {
    if (!budget) return { totalExpense: 0, totalItems: 0, remaining: 0, progress: 0 };

    // Filter only expenses of this budget
    const budgetExpenses = (expenses || []).filter(exp => exp.budgetId === budget.id);

    // Safely parse amounts
    const totalExpense = budgetExpenses.reduce((sum, exp) => {
      const amt = parseFloat(exp.amount);
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);

    const totalItems = budgetExpenses.length;

    const budgetAmount = parseFloat(budget.amount);
    const safeBudgetAmount = isNaN(budgetAmount) ? 0 : budgetAmount;

    const remaining = safeBudgetAmount - totalExpense;
    const progress = safeBudgetAmount > 0 ? Math.min((totalExpense / safeBudgetAmount) * 100, 100) : 0;

    return { totalExpense, totalItems, remaining, progress };
  }, [expenses, budget]);

  if (!budget) return null; // render nothing if no budget

  return (
    <div
      className="bg-green-50 p-4 rounded-2xl shadow-lg cursor-pointer 
                 hover:bg-green-200 hover:scale-105 transform transition-all duration-200"
      onClick={handleClick}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="text-4xl">{budget.icon || '💰'}</div>
        <div className="text-lg font-bold text-green-700">
          ${parseFloat(budget.amount) && !isNaN(parseFloat(budget.amount)) ? parseFloat(budget.amount).toFixed(2) : '0.00'}
        </div>
      </div>

      <h3 className="font-bold text-xl mb-1 text-gray-800">{budget.name}</h3>
      <p className="text-sm text-gray-500 mb-3">{totalItems} Items</p>

      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-700">${totalExpense.toFixed(2)} Spent</span>
        <span className="text-gray-700">${remaining.toFixed(2)} Remaining</span>
      </div>

      <div className="bg-gray-200 h-3 rounded-full overflow-hidden">
        <div
          className="h-3 bg-linear-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default BudgetItem;
