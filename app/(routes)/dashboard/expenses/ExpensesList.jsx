'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ExpensesList() {
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Expenses</h2>
      {expenses.length === 0 ? (
        <p className="text-gray-500">No expenses found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {expenses.map(exp => (
            <div key={exp.id} className="bg-white p-4 rounded-md shadow-md hover:shadow-lg transition-all duration-200">
              <h3 className="font-bold text-lg">{exp.name}</h3>
              <p className="text-gray-500">Amount: ${parseFloat(exp.amount).toFixed(2)}</p>
              <p className="text-gray-400 text-sm">Budget ID: {exp.budgetId}</p>
              <p className="text-gray-400 text-sm">Created by: {exp.created_by}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExpensesList;
