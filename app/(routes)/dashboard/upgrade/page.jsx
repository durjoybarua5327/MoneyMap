'use client';
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center py-16 px-4">
      {/* Hero Section */}
      <h1 className="text-4xl font-bold text-green-800 mb-4 text-center">
        Upgrade to MoneyMap Pro 💎
      </h1>
      <p className="text-gray-600 text-center max-w-2xl mb-10">
        Unlock powerful features to manage your finances smarter and faster. More budgets, smarter insights, and advanced reporting await you!
      </p>

      {/* Comparison Table */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden w-full max-w-3xl">
        <table className="w-full border-collapse text-left">
          <thead className="bg-green-100 text-green-800">
            <tr>
              <th className="py-3 px-5">Feature</th>
              <th className="py-3 px-5 text-center">Free</th>
              <th className="py-3 px-5 text-center">Pro</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['AI Spending Insights', '❌', '✅'],
              ['Export Reports (PDF)', '❌', '✅'],
              ['Custom Themes', '❌', '✅'],
              ['Priority Support', '❌', '✅'],
            ].map(([feature, free, pro], idx) => (
              <tr key={idx} className="border-t">
                <td className="py-3 px-5">{feature}</td>
                <td className="text-center">
                  {free === '✅' ? <CheckCircle className="text-green-500 inline" /> : <XCircle className="text-red-400 inline" />}
                </td>
                <td className="text-center">
                  {pro === '✅' ? <CheckCircle className="text-green-500 inline" /> : <XCircle className="text-red-400 inline" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pricing Section */}
      <div className="mt-10 text-center">
        <h2 className="text-3xl font-semibold text-green-700">৳99/month</h2>
        <p className="text-gray-500 mb-6">Simple pricing, cancel anytime.</p>
        <button className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg transition-transform hover:scale-105">
          Upgrade Now
        </button>
      </div>

      {/* Optional Footer */}
      <p className="mt-10 text-gray-500 text-sm text-center max-w-md">
        *Pro plan unlocks unlimited budgets, AI insights, export reports, and priority support. Free plan remains fully functional for basic budgeting.
      </p>
    </div>
  );
}
