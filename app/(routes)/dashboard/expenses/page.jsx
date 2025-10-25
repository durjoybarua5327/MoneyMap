'use client';
import React, { useEffect, useState } from 'react';
import ExpensesList from './ExpensesList';
import ExpensesItems from './ExpensesItems';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import BudgetItem from '../budgets/_components/BudgetItem';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { Trash2, Edit3, Smile } from 'lucide-react';
import Picker from 'emoji-picker-react';
import { useUser } from '@clerk/nextjs';

function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const userEmail = user?.emailAddresses?.[0]?.emailAddress;

  const budgetId = parseInt(searchParams.get('budgetId'));
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', icon: '', amount: '' });

  /* -------------------- Fetch Budgets + Expenses -------------------- */
  const fetchData = async () => {
    setLoading(true);
    try {
      const [budgetsRes, expensesRes] = await Promise.all([
        axios.get('http://localhost:5000/budgets'),
        axios.get('http://localhost:5000/expenses', { params: { created_by: userEmail } }),
      ]);

      const budgets = budgetsRes.data;
      const selectedBudget = budgetId
        ? budgets.find((b) => b.id === budgetId)
        : budgets[0] || null;

      setBudget(selectedBudget);

      let filteredExpenses = expensesRes.data;
      if (budgetId) filteredExpenses = filteredExpenses.filter((e) => e.budgetId === budgetId);

      setExpenses(filteredExpenses);
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userEmail) fetchData();
  }, [budgetId, userEmail]);

  /* ---------------------- DELETE BUDGET ---------------------- */
  const handleDeleteBudget = async () => {
    if (!budget) return;
    try {
      const res = await axios.delete(`http://localhost:5000/budgets/${budget.id}`);
      toast.success(res.data.message || 'Budget deleted successfully');
      setBudget(null);
      setExpenses([]);
      setIsDeleteModalOpen(false);
      router.push('/dashboard/expenses');
    } catch (err) {
      console.error('Error deleting budget:', err);
      toast.error('Error deleting budget. Please try again.');
      setIsDeleteModalOpen(false);
    }
  };

  /* ---------------------- EDIT BUDGET ---------------------- */
  const openEditModal = () => {
    if (!budget) return;
    setEditForm({
      name: budget.name,
      icon: budget.icon || '',
      amount: budget.amount,
    });
    setIsEditModalOpen(true);
  };

  const handleEditBudget = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:5000/budgets/${budget.id}`, editForm);
      toast.success(res.data.message || 'Budget updated successfully');
      setBudget(prev => ({ ...prev, ...editForm }));
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Error updating budget:', err);
      toast.error('Error updating budget. Please try again.');
    }
  };

  /* ---------------------- EXPENSE HANDLERS ---------------------- */
  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/expenses/${id}`);
      setExpenses(prev => prev.filter(exp => exp.id !== id));
      toast.success('Expense deleted');
    } catch (err) {
      toast.error('Failed to delete expense');
    }
  };

  const handleAddExpense = (newExpense) => {
    setExpenses(prev => [newExpense, ...prev]);
  };

  const handleEditExpense = (updatedExpense) => {
    setExpenses(prev => prev.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp));
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"></div>
        <p className="text-green-700 text-lg font-semibold">Loading your expenses...</p>
      </div>
    );

  return (
    <div className="p-8 bg-green-50 min-h-screen">
      <Toaster position="bottom-right" />
      <h1 className="text-3xl font-bold text-green-800 mb-8 border-b-2 border-green-200 pb-2">
        My Expenses
      </h1>

      {budget && (
        <div className="flex justify-end gap-3 mb-2">
          <button
            onClick={openEditModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition"
          >
            <Edit3 size={18} /> Edit Budget
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition"
          >
            <Trash2 size={18} /> Delete Budget
          </button>
        </div>
      )}

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
              onExpenseAdded={handleAddExpense}
              onExpenseEdited={handleEditExpense}
              refreshData={fetchData}
            />
          </div>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-2xl p-6 border border-green-200">
        <h3 className="text-xl font-semibold mb-4 text-green-800">Latest Expenses</h3>
        <ExpensesItems
          expenses={expenses}
          setExpenses={setExpenses}
          budget={budget}
          setBudget={setBudget}
          refreshData={fetchData}
        />
      </div>

      {/* Delete Modal */}
      {isDeleteModalOpen && budget && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsDeleteModalOpen(false)}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 pointer-events-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-green-700">Delete Budget</h2>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="text-green-500 hover:text-green-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              <p className="mb-4 text-gray-700">
                Are you sure you want to delete the budget <strong>{budget.name}</strong> and all its expenses?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteBudget}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && budget && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setIsEditModalOpen(false);
              setIsEmojiPickerOpen(false);
            }}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 pointer-events-auto relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-green-700">Edit Budget</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-green-500 hover:text-green-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleEditBudget} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Budget Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-400 outline-none"
                    required
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Icon</label>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{editForm.icon || '🌿'}</span>
                    <button
                      type="button"
                      onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center gap-1 text-gray-600"
                    >
                      <Smile size={18} /> Choose
                    </button>
                  </div>
                  {isEmojiPickerOpen && (
                    <div className="absolute z-50 mt-2">
                      <Picker
                        onEmojiClick={(emojiData) => {
                          setEditForm({ ...editForm, icon: emojiData.emoji });
                          setIsEmojiPickerOpen(false);
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-400 outline-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Page;
