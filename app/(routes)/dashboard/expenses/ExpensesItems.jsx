'use client';
import React from 'react';

function ExpensesItems({ expenses }) {
  if (expenses.length === 0) {
    return <p className="text-gray-500">No expenses found</p>;
  }

  return (
    <ul className="divide-y divide-gray-200">
      {expenses.map(exp => (
        <li key={exp.id} className="py-3 flex justify-between">
          <span className="font-medium">{exp.name}</span>
          <span className="text-gray-700">${parseFloat(exp.amount).toFixed(2)}</span>
        </li>
      ))}
    </ul>
  );
}

export default ExpensesItems;
