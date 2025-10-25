'use client';
import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';

function BudgetItem({ budget, expenses = [], setExpenses }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/expenses?budgetId=${budget.id}`);
  };

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
      className="bg-green-50 p-4 rounded-2xl shadow-lg cursor-pointer 
                 hover:bg-green-200 hover:scale-105 transform transition-all duration-200"
      onClick={handleClick}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="text-4xl">{budget.icon || '💰'}</div>
        <div className="text-lg font-bold text-green-700">${parseFloat(budget.amount).toFixed(2)}</div>
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
