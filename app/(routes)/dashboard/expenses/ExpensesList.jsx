'use client';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useUser } from '@clerk/nextjs';

const COOLDOWN_TIME = 4;

function ExpensesList({ budgetId, budget, expenses, setExpenses, onExpenseAdded, refreshData }) {
  const { user } = useUser();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef(null);

  const userEmail = user?.emailAddresses?.[0]?.emailAddress;

  const startCooldown = (seconds = COOLDOWN_TIME) => {
    setCountdown(seconds);
    setIsAdding(true);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setIsAdding(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleAddExpense = async () => {
    if (isAdding) {
      toast.error(`Please wait ${countdown}s before adding another expense.`);
      return;
    }

    if (!name.trim() || !amount.toString().trim()) {
      toast.error('Please fill all fields');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Amount must be a positive number');
      return;
    }

    const totalSpent = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    const remaining = parseFloat(budget.amount || 0) - totalSpent;

    if (parsedAmount > remaining) {
      toast.error(`Amount exceeds remaining budget ($${remaining.toFixed(2)})`);
      return;
    }

    startCooldown();

    try {
      const res = await axios.post('http://localhost:5000/expenses', {
        name,
        amount: parsedAmount,
        budgetId,
        created_by: userEmail || 'unknown',
      });

      const newExpense = {
        id: res.data.id || Date.now(),
        name,
        amount: parsedAmount,
        budgetId,
        created_by: userEmail || 'unknown',
        budgetName: budget.name,
        date: new Date().toISOString(),
        budgetOwner: userEmail || 'unknown',
      };

      setName('');
      setAmount('');

      if (onExpenseAdded) onExpenseAdded(newExpense);
      else setExpenses(prev => [newExpense, ...prev]);

      // Refresh full data from backend to keep budget & expenses in sync
      if (refreshData) await refreshData();

      toast.success('Expense added successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Error adding expense. Please check backend.');
    }
  };

  if (!budget) return null;

  const totalSpent = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const remaining = parseFloat(budget.amount || 0) - totalSpent;
  const progress = Math.min((totalSpent / budget.amount) * 100, 100);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between bg-white shadow-lg rounded-2xl p-6 gap-6">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2 sm:gap-0">
            <h2 className="text-xl font-bold text-green-700">{budget.name}</h2>
            <p className="font-semibold text-green-800">${parseFloat(budget.amount).toFixed(2)}</p>
          </div>
          <p className="text-gray-600 mb-2">{expenses.length} Items</p>
          <div className="flex flex-col sm:flex-row justify-between text-sm mb-2 gap-2 sm:gap-0">
            <span className="text-gray-700">${totalSpent.toFixed(2)} Spent</span>
            <span className="text-gray-700">${remaining.toFixed(2)} Remaining</span>
          </div>
          <div className="w-full bg-gray-200 h-3 rounded-full">
            <div
              className="h-3 bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full md:w-64">
          <input
            type="text"
            placeholder="Expense Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="border rounded-md p-2 focus:outline-green-600 w-full"
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="border rounded-md p-2 focus:outline-green-600 w-full"
          />
          <button
            onClick={handleAddExpense}
            disabled={isAdding}
            className={`relative bg-green-600 text-white rounded-md py-2 hover:bg-green-700 transition-all ${
              isAdding ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isAdding ? `Please wait ${countdown}s...` : 'Add Expense'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExpensesList;
