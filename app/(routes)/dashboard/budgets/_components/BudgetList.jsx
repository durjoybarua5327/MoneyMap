'use client';
import React, { useEffect, useState } from 'react';
import CreateBudget from './CreateBudget';
import BudgetItem from './BudgetItem';
import axios from 'axios';

function BudgetList() {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/budgets')
      .then(res => setBudgets(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost:5000/expenses')
      .then(res => setExpenses(res.data))
      .catch(err => console.error(err));
  }, []);

  const getTotalExpense = (budgetId) => {
    return expenses
      .filter(exp => exp.budgetId === budgetId)
      .reduce((total, exp) => total + parseFloat(exp.amount), 0);
  }

  return (
    <div className='mt-7'>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        <CreateBudget />

        {budgets.map(budget => (
          <BudgetItem
            key={budget.id}
            budget={budget}
            totalExpense={getTotalExpense(budget.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default BudgetList;
