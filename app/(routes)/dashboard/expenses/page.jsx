import React from 'react';
import ExpensesList from './ExpensesList';

function page() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-green-700 mb-6">My Expenses</h1>
      <ExpensesList />
    </div>
  );
}

export default page;
