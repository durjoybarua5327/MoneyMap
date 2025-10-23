"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideNav from "./_components/SideNav";
import DashBoardHeader from "./_components/DashBoardHeader";

function DashboardLayout({ children }) {
  const router = useRouter();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const res = await fetch("http://localhost:5000/budgets");
        if (!res.ok) throw new Error("Failed to fetch budgets");
        const data = await res.json();

        if (Array.isArray(data)) {
          setBudgets(data);
          if (data.length === 0) {
            router.push("/dashboard/budgets"); // redirect if no budgets
          }
        } else {
          setBudgets([]);
          router.push("/dashboard/budgets"); // redirect if data is not an array
        }
      } catch (err) {
        console.error(err);
        setBudgets([]);
        router.push("/dashboard/budgets"); // redirect on error
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex min-h-screen">
      <div className="w-[20%] fixed h-screen border-r bg-white">
        <SideNav />
      </div>
      <div className="ml-[20%] w-[80%] p-4 min-h-screen">
        <DashBoardHeader />
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayout;
