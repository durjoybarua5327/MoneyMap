'use client';
import React, { useEffect, useState } from 'react';
import ExpensesItems from './expenses/ExpensesItems';
import ExpensesBudgetBar from './Expenses_budget_bar';
import ExpensesBasedOnDate from './expenses_based_on_date';
import { useUser } from '@clerk/nextjs'; // adjust if using different auth

export default function DashboardLayout() {
  const { user } = useUser(); // get logged-in user info
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return; // don't fetch if not logged in

      try {
        const email = user.emailAddresses[0].emailAddress; // or user.id if you store user IDs
        const [budgetRes, expenseRes] = await Promise.all([
          fetch(`http://localhost:5000/budgets?created_by=${email}`),
          fetch(`http://localhost:5000/expenses?created_by=${email}`),
        ]);

        if (!budgetRes.ok || !expenseRes.ok) {
          throw new Error('Failed to fetch data from backend');
        }

        const budgetsData = await budgetRes.json();
        const expensesData = await expenseRes.json();

        setBudgets(budgetsData);
        setExpenses(expensesData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-screen bg-yellow-50">
        <p className="text-yellow-700 font-semibold">
          Please log in to view your dashboard.
        </p>
      </div>
    );

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-green-50">
        <p className="text-green-700 font-semibold animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <p className="text-red-600 font-semibold">Error: {error}</p>
      </div>
    );

  const totalBudget = budgets.reduce(
    (sum, b) => sum + parseFloat(b.amount || 0),
    0
  );
  const totalSpend = expenses.reduce(
    (sum, e) => sum + parseFloat(e.amount || 0),
    0
  );

  return (
    <div className="p-8 bg-green-50 min-h-screen space-y-8">
      <h1 className="text-4xl font-extrabold text-green-800 text-center mb-6 drop-shadow-sm">
        💰 Smart Finance Dashboard
      </h1>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:scale-105 transition-transform">
          <h3 className="font-semibold text-gray-500">Total Budget</h3>
          <p className="text-2xl font-bold text-green-700 mt-2">
            ${totalBudget.toFixed(2)}
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:scale-105 transition-transform">
          <h3 className="font-semibold text-gray-500">Total Spend</h3>
          <p className="text-2xl font-bold text-red-700 mt-2">
            ${totalSpend.toFixed(2)}
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:scale-105 transition-transform">
          <h3 className="font-semibold text-gray-500">Number of Budgets</h3>
          <p className="text-2xl font-bold text-blue-700 mt-2">
            {budgets.length}
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Budget vs Expenses
          </h2>
          <ExpensesBudgetBar budgets={budgets} expenses={expenses} />
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Expenses Over Time
          </h2>
          <ExpensesBasedOnDate expenses={expenses} />
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Latest Expenses
        </h2>
        <ExpensesItems expenses={expenses} />
      </div>
    </div>
  );
}
