'use client';
import React from 'react';
import BudgetList from './BudgetList';

function page() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-green-700 mb-6">My Budgets & Expenses</h1>
      <BudgetList />
    </div>
  );
}

export default page;
