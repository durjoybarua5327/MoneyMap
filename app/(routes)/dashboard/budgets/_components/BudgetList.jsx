'use client';
import React, { useEffect, useState } from 'react';
import CreateBudget from './CreateBudget';
import axios from 'axios';

function BudgetList() {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    // Fetch all budgets
    axios.get('http://localhost:5000/budgets')
      .then(res => setBudgets(res.data))
      .catch(err => console.error(err));

    // Fetch all expenses
    axios.get('http://localhost:5000/expenses')
      .then(res => setExpenses(res.data))
      .catch(err => console.error(err));
  }, []);

  // Function to calculate total expense for a budget
  const getTotalExpense = (budgetId) => {
    return expenses
      .filter(exp => exp.budgetId === budgetId)
      .reduce((total, exp) => total + parseFloat(exp.amount), 0);
  }

  return (
    <div className='mt-7'>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        <CreateBudget />

        {budgets.map(budget => {
          const totalExpense = getTotalExpense(budget.id);
          const remaining = parseFloat(budget.amount) - totalExpense;

          return (
            <div key={budget.id} className='bg-white p-4 rounded-md shadow-md'>
              <div className='text-2xl'>{budget.icon || '💰'}</div>
              <h3 className='font-bold text-lg mt-2'>{budget.name}</h3>
              <p>Total Budget: ${budget.amount}</p>
              <p>Spent: ${totalExpense.toFixed(2)}</p>
              <p>Remaining: ${remaining.toFixed(2)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BudgetList;
