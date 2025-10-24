'use client';
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

function ExpensesItems({ expenses, setExpenses, budget, setBudget }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Open modal
  const openModal = (expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setSelectedExpense(null);
    setIsModalOpen(false);
  };

  // Delete expense
  const handleDelete = async () => {
    if (!selectedExpense) return;

    try {
      const res = await axios.delete(`http://localhost:5000/expenses/${selectedExpense.id}`);

      // Remove from local state
      const newExpenses = expenses.filter(e => e.id !== selectedExpense.id);
      setExpenses(newExpenses);

      // Update budget
      if (budget) {
        const updatedBudget = {
          ...budget,
          amount: (parseFloat(budget.amount) + parseFloat(selectedExpense.amount)).toFixed(2),
        };
        setBudget(updatedBudget);
      }

      toast.success(res.data.message || "Expense deleted successfully");
      closeModal();
    } catch (err) {
      console.error("Error deleting expense:", err);
      toast.error("Error deleting expense. Please try again.");
      closeModal();
    }
  };

  if (expenses.length === 0) {
    return (
      <p className="text-gray-500 text-center py-6">
        No expenses found
      </p>
    );
  }

  return (
    <div className="relative">
      <ul className="flex flex-col gap-3">
        {expenses.map(exp => (
          <li
            key={exp.id}
            className="flex justify-between items-center bg-green-50 shadow-sm rounded-lg p-4 hover:shadow-md hover:bg-green-100 transition-all"
          >
            <div className="flex flex-col">
              <span className="font-semibold text-lg">{exp.name}</span>
              {exp.date && (
                <span className="text-gray-400 text-sm mt-1">
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
              <span className="font-medium text-green-600">
                ${parseFloat(exp.amount).toFixed(2)}
              </span>

              <button
                onClick={() => openModal(exp)}
                className="text-red-500 hover:text-red-700 transition-colors"
                title="Delete expense"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* 🗑️ Delete Confirmation Modal */}
      {isModalOpen && selectedExpense && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 pointer-events-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-green-700">Delete Expense</h2>
                <button
                  onClick={closeModal}
                  className="text-green-500 hover:text-green-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <p className="mb-4 text-gray-700">
                Are you sure you want to delete <strong>{selectedExpense.name}</strong>?
              </p>

              {/* ✅ Show date inside modal */}
              {selectedExpense.date && (
                <p className="text-sm text-gray-500 mb-6">
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
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
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
