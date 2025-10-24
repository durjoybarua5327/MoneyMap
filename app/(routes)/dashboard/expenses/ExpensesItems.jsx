'use client';
import React from 'react';

function ExpensesItems({ expenses }) {
  if (expenses.length === 0) {
    return (
      <p className="text-gray-500 text-center py-6">
        No expenses found
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {expenses.map(exp => (
        <li
          key={exp.id}
          className="flex justify-between items-center bg-green-50 shadow-sm rounded-lg p-4 hover:shadow-md hover:bg-green-200 transition-all"
        >
          <div className="flex flex-col">
            <span className="font-semibold text-lg">{exp.name}</span>
            {exp.date && (
              <span className="text-gray-400 text-sm mt-1">
                {new Date(exp.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>

          <span className="font-medium text-green-500">${parseFloat(exp.amount).toFixed(2)}</span>
        </li>
      ))}
    </ul>
  );
}

export default ExpensesItems;
