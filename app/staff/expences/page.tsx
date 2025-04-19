"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface expeces_table {
  expense_id: number;
  description: string;
  amount: number;
  expense_date: string;
  Staff?: {
    name: string;
  };
}

export default function StaffExpenses() {
  const { status } = useSession();
  const [expenseList, setExpenseList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "loading") return;

    setLoading(true);
    fetch("/api/staff/expences") // Use the staff-specific endpoint
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API returned ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched staff expenses:", data);
        setExpenseList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching expenses:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [status]);

  const filteredExpenseList = expenseList.filter((expense: expeces_table) => {
    // Search term filter
    const matchesSearch =
      searchTerm === "" ||
      (expense.description &&
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Display loading or authentication states
  if (status === "loading") {
    return <p className="p-8">Loading session...</p>;
  }

  if (status === "unauthenticated") {
    return <p className="p-8">You must be signed in to view your expenses.</p>;
  }

  return (
    <div className="bg-white min-h-screen p-4 md:p-8 flex flex-col md:grid md:grid-cols-2 md:grid-rows-1 gap-6">
      {/* Mobile search - visible only on small screens */}
      <div className="md:hidden mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Expenses</h1>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Find Expense
          </h3>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search Expenses"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white
              text-gray-700"
            />
            <svg
              className="w-5 h-5 absolute right-3 top-3 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Mobile Total Summary */}
          <div className="mt-2">
            <div className="text-sm text-gray-700 font-medium">
              Total:{" "}
              {formatCurrency(
                filteredExpenseList.reduce(
                  (sum: number, expense: expeces_table) =>
                    sum + Number(expense.amount),
                  0
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Left side: Expenses list */}
      <div className="md:pr-4 overflow-y-auto order-2 md:order-1">
        <h1 className="hidden md:block text-3xl font-bold text-gray-800 mb-6 pl-2">
          Your Expenses
        </h1>

        <div className="md:pl-12">
          {loading ? (
            <p className="text-center py-4">Loading expenses...</p>
          ) : error ? (
            <p className="text-red-500 text-center py-4">Error: {error}</p>
          ) : filteredExpenseList.length === 0 ? (
            <div className="text-center py-4">
              <p>No expenses match your filters.</p>
              <p className="text-sm text-gray-500 mt-2">
                Try clearing filters or contact your administrator.
              </p>
            </div>
          ) : (
            filteredExpenseList.map((expense: expeces_table) => (
              <div
                key={expense.expense_id}
                className="grid grid-cols-1 grid-rows-2 mb-6 md:mb-8 p-3 rounded-lg hover:bg-gray-50"
              >
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                    Description: {expense.description}
                  </h2>
                </div>
                <div className="flex flex-col ml-2 mt-[-6px]">
                  <div className="font-medium text-gray-700">
                    {formatCurrency(Number(expense.amount))}
                  </div>
                  <div className="font-medium text-gray-700">
                    Date: {new Date(expense.expense_date).toLocaleDateString()}
                  </div>
                  <div className="font-medium text-gray-700">
                    Paid by: {expense.Staff?.name || "You"}
                  </div>
                </div>
                <div className="mt-6 mb-[-10px]">
                  <hr className="w-full md:w-[70%]" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right side: Fixed search component - desktop only */}
      <div className="hidden md:block relative order-1 md:order-2">
        <div className="sticky top-[30%] left-0 flex justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Find Expense
            </h3>

            {/* Search Input */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Expenses"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white dark:bg-gray-700
                    text-gray-700 dark:text-gray-200"
                />
                <svg
                  className="w-5 h-5 absolute right-3 top-3 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Optional: You could add date filters here */}
            <div className="mt-4">
              <div className="text-sm text-gray-600">
                Total:{" "}
                {formatCurrency(
                  filteredExpenseList.reduce(
                    (sum: number, expense: expeces_table) =>
                      sum + Number(expense.amount),
                    0
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
