"use client";

import { useEffect, useState } from "react";

function Page() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const res = await fetch("http://localhost:5000/budgets");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log("Fetched budgets:", data); // debug
        // Ensure data is an array
        if (Array.isArray(data)) {
          setBudgets(data);
        } else {
          console.error("Budgets data is not an array:", data);
          setBudgets([]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  if (loading) return <p>Loading budgets...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Dashboard Page</h1>
      {budgets.length === 0 ? (
        <p>No budgets found.</p>
      ) : (
        <ul>
          {budgets.map((budget) => (
            <li key={budget.id}>
              {budget.name} - {budget.amount} - {budget.icon} - {budget.created_by}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Page;
