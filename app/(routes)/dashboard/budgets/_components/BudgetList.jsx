'use client';
import React, { useEffect, useState } from 'react';
import CreateBudget from './CreateBudget';
import BudgetItem from './BudgetItem';
import axios from 'axios';
import { useUser } from "@clerk/nextjs";

function BudgetList() {
  const { user } = useUser();
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const email = user.primaryEmailAddress.emailAddress;

      const [budgetRes, expenseRes] = await Promise.all([
        axios.get(`http://localhost:5000/budgets?created_by=${email}`),
        axios.get(`http://localhost:5000/expenses?created_by=${email}`)
      ]);

      setBudgets(budgetRes.data);
      setExpenses(expenseRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (loading) return <p className="text-gray-500">Loading budgets...</p>;

  return (
    <div className='mt-7'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <CreateBudget onBudgetCreated={fetchData} />

        {budgets.length === 0 ? (
          <p className="text-center col-span-full text-green-400">
            No budgets yet. Create one above!
          </p>
        ) : (
          budgets.map(budget => (
            <BudgetItem
              key={budget.id}
              budget={budget}
              expenses={expenses}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default BudgetList;
