'use client';
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

function ExpensesItems({ expenses, setExpenses, budget, setBudget, refreshData }) {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const userEmail = user?.emailAddresses?.[0]?.emailAddress;

  const openModal = (expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedExpense(null);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedExpense) return;

    try {
      const res = await axios.delete(
        `http://localhost:5000/expenses/${selectedExpense.id}`
      );
      toast.success(res.data.message || 'Expense deleted successfully');

      // Remove expense from state
      setExpenses(prev => prev.filter(e => e.id !== selectedExpense.id));

      // Refetch full data from backend to sync budget and expenses
      if (refreshData) await refreshData();
      closeModal();
    } catch (err) {
      console.error('Error deleting expense:', err);
      toast.error('Error deleting expense. Please try again.');
      closeModal();
    }
  };

  if (!expenses || expenses.length === 0) {
    return (
      <p className="text-gray-500 text-center py-6 text-lg">
        No expenses found
      </p>
    );
  }

  // Filter expenses by current user if available
  const filteredExpenses = userEmail
    ? expenses.filter(exp => exp.budgetOwner === userEmail)
    : expenses;

  if (filteredExpenses.length === 0) {
    return (
      <p className="text-gray-500 text-center py-6 text-lg">
        No expenses found for your account
      </p>
    );
  }

  return (
    <div className="relative">
      <ul className="flex flex-col gap-4">
        {filteredExpenses.map(exp => (
          <li
            key={exp.id}
            className="flex justify-between items-center bg-white shadow-md hover:shadow-xl rounded-2xl p-5 transition-all border border-gray-100"
          >
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-lg text-green-600">{exp.name}</span>
              {exp.budgetName && (
                <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full w-fit">
                  {exp.budgetName}
                </span>
              )}
              {exp.date && (
                <span className="text-gray-400 text-sm">
                  {new Date(exp.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="font-semibold text-green-600 text-lg">
                ${parseFloat(exp.amount).toFixed(2)}
              </span>
              <button
                onClick={() => openModal(exp)}
                className="text-red-500 hover:text-red-700 transition-colors"
                title="Delete expense"
              >
                <Trash2 size={22} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Delete Modal */}
      {isModalOpen && selectedExpense && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 pointer-events-auto animate-slide-up">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-red-600">Delete Expense</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <p className="mb-3 text-gray-700 text-sm">
                Are you sure you want to delete <strong>{selectedExpense.name}</strong>?
              </p>

              {selectedExpense.budgetName && (
                <p className="mb-3 text-xs text-indigo-600 font-medium">
                  Budget: {selectedExpense.budgetName}
                </p>
              )}

              {selectedExpense.date && (
                <p className="mb-6 text-xs text-gray-500">
                  Date:{" "}
                  {new Date(selectedExpense.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ExpensesItems;
