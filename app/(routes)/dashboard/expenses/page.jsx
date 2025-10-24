'use client';
import React, { useEffect, useState } from 'react';
import ExpensesList from './ExpensesList';
import ExpensesItems from './ExpensesItems';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import BudgetItem from '../budgets/_components/BudgetItem';
import { Toaster, toast } from 'react-hot-toast';

function Page() {
  const searchParams = useSearchParams();
  const budgetId = parseInt(searchParams.get('budgetId'));
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const budgetsRes = await axios.get('http://localhost:5000/budgets');
        const budgets = budgetsRes.data;

        if (budgetId) {
          const selectedBudget = budgets.find(b => b.id === budgetId);
          setBudget(selectedBudget || null);
        } else {
          setBudget(null);
        }

        const expensesRes = await axios.get('http://localhost:5000/expenses');
        let filtered = expensesRes.data;

        if (budgetId) {
          filtered = filtered.filter(e => e.budgetId === budgetId);
        }

        setExpenses(filtered);
      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [budgetId]);

  const handleExpenseAdded = newExpense => {
    setExpenses(prev => [...prev, newExpense]);
    toast.success(`Expense "${newExpense.name}" added!`);
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"></div>
        <p className="text-green-700 text-lg font-semibold">
          Loading your expenses...
        </p>
      </div>
    );

  return (
    <div className="p-8 bg-green-50 min-h-screen">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-green-800 mb-8 border-b-2 border-green-200 pb-2">
        My All Expenses
      </h1>

      {budget && (
        <div className="flex flex-col md:flex-row items-start gap-8 mb-8">
          <div className="w-full md:w-80">
            <BudgetItem
              budget={budget}
              expenses={expenses}
              className="bg-white shadow-lg rounded-2xl p-6 border-l-4 border-green-400"
            />
          </div>

          <div className="w-full md:flex-1 flex flex-col gap-6">
            <ExpensesList
              budgetId={budgetId}
              budget={budget}
              expenses={expenses}
              setExpenses={setExpenses}
              onExpenseAdded={handleExpenseAdded}
            />
          </div>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-2xl p-6 border border-green-200">
        <h3 className="text-xl font-semibold mb-4 text-green-800">
          Latest Expenses
        </h3>
        <ExpensesItems
          expenses={expenses}
          setExpenses={setExpenses}
          budget={budget}
          setBudget={setBudget}
        />
      </div>
    </div>
  );
}

export default Page;
