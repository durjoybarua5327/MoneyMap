"use client";
import React, { useState, useEffect } from 'react';
import Picker from 'emoji-picker-react';
import { useUser } from "@clerk/nextjs";
import toast, { Toaster } from 'react-hot-toast';

function CreateBudget() {
  const { user } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    icon: '💰'
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [budgetSuggestions, setBudgetSuggestions] = useState([]);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  // Fetch existing budgets for suggestions
  useEffect(() => {
    if (!user) return;

    const fetchBudgets = async () => {
      try {
        const response = await fetch(`http://localhost:5000/budgets?user=${user.emailAddresses[0].emailAddress}`);
        const data = await response.json();
        if (response.ok) {
          setBudgetSuggestions(data.map(b => b.name));
        } else {
          console.error("Failed to fetch budgets:", data.error);
        }
      } catch (err) {
        console.error("Error fetching budgets:", err);
      }
    };

    fetchBudgets();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onEmojiClick = (emojiData) => {
    setFormData(prev => ({ ...prev, icon: emojiData.emoji }));
    setShowEmojiPicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to create a budget", { position: "bottom-right" });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          amount: formData.amount,
          icon: formData.icon,
          created_by: user.emailAddresses[0].emailAddress
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? 'animate-enter' : 'animate-leave'
              } max-w-md w-full bg-green-400 text-white rounded-lg shadow-lg p-4 flex items-center space-x-3`}
            >
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-bold">Budget Created!</p>
                <p>{formData.name} has been added successfully.</p>
              </div>
            </div>
          ),
          { position: "bottom-right" }
        );

        setFormData({ name: "", amount: "", icon: "💰" });
        setBudgetSuggestions(prev => [...new Set([...prev, formData.name])]);
        closeDialog();
      } else {
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? 'animate-enter' : 'animate-leave'
              } max-w-md w-full bg-red-600 text-white rounded-lg shadow-lg p-4 flex items-center space-x-3`}
            >
              <span className="text-2xl">❌</span>
              <div>
                <p className="font-bold">Error!</p>
                <p>{data.error || "Failed to create budget"}</p>
              </div>
            </div>
          ),
          { position: "bottom-right" }
        );
      }
    } catch (err) {
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-red-600 text-white rounded-lg shadow-lg p-4 flex items-center space-x-3`}
          >
            <span className="text-2xl">❌</span>
            <div>
              <p className="font-bold">Error!</p>
              <p>Failed to create budget</p>
            </div>
          </div>
        ),
        { position: "bottom-right" }
      );
    }
  };

  return (
    <div className="relative">
      {/* Toaster for toast notifications */}
      <Toaster position="bottom-right" />

      {/* Clickable card */}
      <div 
        className='bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md'
        onClick={openDialog}
      >
        <h2 className='text-3xl text-green-600'>+</h2>
        <h2 className='text-green-700'>Create New Budget</h2>
      </div>

      {isDialogOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={closeDialog}></div>

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 pointer-events-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-green-700">Create New Budget</h2>
                <button onClick={closeDialog} className="text-green-500 hover:text-green-700 text-2xl font-bold">×</button>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">Name</label>
                  <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Budget Name"
                    list="budget-suggestions"
                    required
                  />
                  <datalist id="budget-suggestions">
                    {budgetSuggestions.map((name, idx) => (
                      <option key={idx} value={name} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">Amount</label>
                  <input 
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">Icon</label>
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="px-3 py-2 border border-gray-300 rounded-md w-full text-left focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {formData.icon}
                  </button>
                  {showEmojiPicker && <div className="mt-2"><Picker onEmojiClick={onEmojiClick} /></div>}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button type="button" onClick={closeDialog} className="px-4 py-2 text-sm font-medium text-green-700 hover:text-green-900 transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors">Create Budget</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CreateBudget;
