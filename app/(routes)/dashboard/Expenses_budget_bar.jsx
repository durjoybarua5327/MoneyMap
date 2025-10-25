'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts';

export default function ExpensesBudgetBar({ budgets, expenses }) {
  if (!budgets?.length || !expenses?.length) {
    return (
      <p className="text-gray-500 text-center py-4">
        Not enough data to display
      </p>
    );
  }

  // ✅ Aggregate total expense per budget
  const budgetExpenseData = budgets.map((b) => {
    const totalExpense = expenses
      .filter((e) => e.budgetId === b.id) // ✅ FIXED HERE
      .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

    return {
      name: b.name,
      Budget: parseFloat(b.amount),
      Spent: totalExpense,
    };
  });

  return (
    <div className="w-full h-80 bg-white rounded-xl shadow p-4">
      <h3 className="font-semibold text-gray-700 mb-3 text-center">
        Budget vs Expenses
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={budgetExpenseData} barGap={8}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Budget" fill="#86efac" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Spent" fill="#f87171" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
