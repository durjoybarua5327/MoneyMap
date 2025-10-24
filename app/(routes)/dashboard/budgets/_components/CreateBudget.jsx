'use client';
import React, { useState, useEffect, useRef } from 'react';
import Picker from 'emoji-picker-react';
import { useUser } from "@clerk/nextjs";
import toast, { Toaster } from 'react-hot-toast';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function CreateBudget({ onBudgetCreated }) {
  const { user } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    icon: '💰',
    date: new Date()
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [budgetSuggestions, setBudgetSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);

  const suggestionRef = useRef(null);
  const inputRef = useRef(null);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  // Custom Toast Functions
  const successToast = (message) => {
    toast.success(message, {
      style: {
        border: '1px solid #4ADE80',
        padding: '16px',
        color: '#065F46',
        background: 'linear-gradient(135deg, #D1FAE5, #6EE7B7)',
        borderRadius: '12px',
        fontWeight: 'bold',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      },
      icon: '✅',
      duration: 4000,
      position: 'bottom-right',
    });
  };

  const errorToast = (message) => {
    toast.error(message, {
      style: {
        border: '1px solid #F87171',
        padding: '16px',
        color: '#B91C1C',
        background: 'linear-gradient(135deg, #FEE2E2, #FCA5A5)',
        borderRadius: '12px',
        fontWeight: 'bold',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      },
      icon: '⚠️',
      duration: 4000,
      position: 'bottom-right',
    });
  };

  // Fetch existing budgets for suggestions
  useEffect(() => {
    if (!user) return;
    const fetchBudgets = async () => {
      try {
        const response = await fetch(`http://localhost:5000/budgets?user=${user.emailAddresses[0].emailAddress}`);
        const data = await response.json();
        if (response.ok) setBudgetSuggestions(data.map(b => b.name));
      } catch (err) {
        console.error("Error fetching budgets:", err);
      }
    };
    fetchBudgets();
  }, [user]);

  // Filter suggestions dynamically
  useEffect(() => {
    if (formData.name.trim() === '') setFilteredSuggestions([]);
    else {
      const filtered = budgetSuggestions.filter(name =>
        name.toLowerCase().includes(formData.name.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    }
  }, [formData.name, budgetSuggestions]);

  // Hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionRef.current && !suggestionRef.current.contains(event.target) &&
        inputRef.current && !inputRef.current.contains(event.target)
      ) {
        setFilteredSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSuggestionClick = (name) => {
    setFormData(prev => ({ ...prev, name }));
    setFilteredSuggestions([]);
  };

  const onEmojiClick = (emojiData) => {
    setFormData(prev => ({ ...prev, icon: emojiData.emoji }));
    setShowEmojiPicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      errorToast("You must be logged in to create a budget");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          amount: parseFloat(formData.amount) || 0,
          icon: formData.icon,
          date: formData.date.toISOString().split('T')[0],
          created_by: user.emailAddresses[0].emailAddress
        }),
      });

      const data = await response.json();
      if (response.ok) {
        successToast(`Budget "${formData.name}" created!`);
        setFormData({ name: "", amount: "", icon: "💰", date: new Date() });
        setBudgetSuggestions(prev => [...new Set([...prev, formData.name])]);
        closeDialog();
        if (onBudgetCreated) onBudgetCreated();
      } else {
        errorToast(data.error || "Failed to create budget");
      }
    } catch (err) {
      errorToast("Failed to create budget");
    }
  };

  return (
    <div className="relative p-4">
      <Toaster position="bottom-right" />

      {/* Clickable card */}
      <div
        className="bg-green-50 py-9 px-5 rounded-md shadow-md cursor-pointer 
             hover:bg-green-200 hover:scale-105 active:scale-95 
             transform transition-all duration-200
             flex flex-col justify-center items-center"
        onClick={openDialog}
      >
        <div className="text-3xl text-green-500 mb-2">+</div>
        <h2 className="text-lg font-bold text-green-400 text-center">Create New Budget</h2>
      </div>

      {/* Dialog */}
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
                {/* Name input */}
                <div className="relative" ref={suggestionRef}>
                  <label className="block text-sm font-medium text-green-700 mb-1">Name</label>
                  <input
                    ref={inputRef}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Budget Name"
                    required
                  />
                  {filteredSuggestions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-auto shadow-lg">
                      {filteredSuggestions.map((name, idx) => (
                        <li
                          key={idx}
                          className="px-3 py-2 hover:bg-green-100 cursor-pointer"
                          onClick={() => handleSuggestionClick(name)}
                        >
                          {name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Amount input */}
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

                {/* Emoji picker */}
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

                {/* Date picker */}
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">Date (optional)</label>
                  <input
                    type="text"
                    readOnly
                    value={formData.date.toDateString()}
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {showCalendar && (
                    <div className="mt-2 z-50">
                      <Calendar
                        onChange={date => {
                          setFormData(prev => ({ ...prev, date }));
                          setShowCalendar(false);
                        }}
                        value={formData.date}
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeDialog}
                    className="px-4 py-2 text-sm font-medium text-green-700 hover:text-green-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                  >
                    Create Budget
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

export default CreateBudget;
