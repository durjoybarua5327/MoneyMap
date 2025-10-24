import React from 'react';
import BudgetList from './_components/BudgetList';

function Page() {
  return (
    <div className="p-8 bg-green-50 min-h-screen">
      {/* Page Header */}
      <h2 className="text-3xl font-bold text-green-800 mb-8 border-b-2 border-green-200 pb-2">
        My Budgets
      </h2>

      {/* Budget List Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-green-200">
        <BudgetList />
      </div>
    </div>
  );
}

export default Page;
