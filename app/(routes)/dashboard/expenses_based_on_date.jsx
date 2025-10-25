'use client';
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function ExpensesBasedOnDate({ expenses }) {
  if (!expenses?.length) {
    return <p className="text-gray-500 text-center">No expense data found</p>;
  }

  // Convert and group expenses by date
  const dateMap = {};

  expenses.forEach((e) => {
    const date = new Date(e.date).toLocaleDateString('en-GB');
    dateMap[date] = (dateMap[date] || 0) + parseFloat(e.amount || 0);
  });

  const chartData = Object.entries(dateMap).map(([date, total]) => ({
    date,
    total,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="total" stroke="#16a34a" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
