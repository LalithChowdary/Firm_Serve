"use client";
import React, { useState, useEffect } from "react";

interface billing_table {
  billing_id: string; // Changed from Billing_id: number
  Client: {
    name: string;
  };
  amount: string;
  status: string;
  due_date: string; // Changed from Due_date
}

interface BillingProps {
  onSelectBilling?: (id: string) => void;
}

export default function Billing({ onSelectBilling }: BillingProps) {
  const [billingList, setBillingList] = useState<billing_table[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/billing")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Billing data:", data);

        // Log the first billing item to see actual field names
        if (data && data.length > 0) {
          console.log("First billing fields:", Object.keys(data[0]));
        }

        setBillingList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching Billing data:", err);
        setLoading(false);
      });
  }, []);

  const filteredBillingList = billingList.filter((bill: billing_table) => {
    // Search term filter
    const matchesSearch =
      searchTerm === "" ||
      (bill.Client.name &&
        bill.Client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (bill.amount &&
        bill.amount
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    // Status filter
    let matchesBill = selectedStatus === "";
    if (!matchesBill && bill.status) {
      matchesBill = bill.status
        .toLowerCase()
        .includes(selectedStatus.toLowerCase());
    }

    return matchesSearch && matchesBill;
  });

  const handleStatusChange = (status: string) => {
    console.log("Setting status to:", status);
    setSelectedStatus(status);
  };

  // Debug logging for state changes
  console.log("Current status filter:", selectedStatus);

  return (
    <div className="bg-white min-h-screen p-4 md:p-8 flex flex-col md:grid md:grid-cols-2 md:grid-rows-1 gap-6">
      {/* Mobile search - visible only on small screens */}
      <div className="md:hidden mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Billing Overview
        </h1>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Find Bills
          </h3>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search Bills"
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

          {/* Mobile Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Status
            </label>
            <div className="flex flex-wrap gap-2">
              {["", "Paid", "Pending", "Overdue"].map((status) => (
                <div className="flex items-center mr-4" key={status || "all"}>
                  <div className="relative flex items-center mr-2">
                    <input
                      type="radio"
                      id={`status-mobile-${status || "all"}`}
                      name="status-mobile"
                      value={status}
                      checked={selectedStatus === status}
                      onChange={() => handleStatusChange(status)}
                      className="appearance-none w-4 h-4 rounded-full border border-black checked:bg-black checked:border-black focus:ring-0 focus:outline-none focus:border-black"
                      style={{ accentColor: "black" }}
                    />
                  </div>
                  <label
                    htmlFor={`status-mobile-${status || "all"}`}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {status === ""
                      ? "All"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Left side: Billing list */}
      <div className="md:pr-4 overflow-y-auto order-2 md:order-1">
        <h1 className="hidden md:block text-3xl font-bold text-gray-800 mb-6 pl-2">
          Billing Overview
        </h1>

        <div className="md:pl-12">
          {loading ? (
            <p className="text-center py-4">Loading billings...</p>
          ) : filteredBillingList.length === 0 ? (
            <div className="text-center py-4">
              <p>No Bills match your filters.</p>
              <p className="text-sm text-gray-500 mt-2">
                Try clearing filters or checking the browser console for
                debugging info.
              </p>
            </div>
          ) : (
            filteredBillingList.map((bill: billing_table) => (
              <div
                key={bill.billing_id}
                className="grid grid-cols-1 grid-rows-2 mb-6 md:mb-8 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                onClick={() =>
                  onSelectBilling && onSelectBilling(bill.billing_id)
                }
              >
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                    {bill.Client.name}{" "}
                  </h2>
                </div>
                <div className="flex flex-col ml-2 mt-[-13px]">
                  <div className="font-medium text-gray-700">
                    Amount: ${bill.amount}
                  </div>
                  <div className="font-medium text-gray-700">
                    Status:{" "}
                    <span
                      className={`${
                        bill.status.toLowerCase() === "paid"
                          ? "text-green-600"
                          : "text-amber-600"
                      }`}
                    >
                      {bill.status}
                    </span>
                  </div>
                  <div>
                    {bill.status.toLowerCase() !== "paid" && (
                      <div className="font-medium text-gray-700">
                        Due date: {new Date(bill.due_date).toLocaleDateString()}
                      </div>
                    )}
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
              Find Bills
            </h3>

            {/* Search Input */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Bills"
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

            {/* Filters */}
            <div className="grid grid-cols-1 gap-6">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Status
                </label>
                <div className="space-y-2">
                  {["", "Paid", "Pending", "Overdue"].map((status) => (
                    <div className="flex items-center" key={status || "all"}>
                      <div className="relative flex items-center mr-2">
                        <input
                          type="radio"
                          id={`status-${status || "all"}`}
                          name="status"
                          value={status}
                          checked={selectedStatus === status}
                          onChange={() => handleStatusChange(status)}
                          className="appearance-none w-4 h-4 rounded-full border border-black checked:bg-black checked:border-black focus:ring-0 focus:outline-none focus:border-black"
                          style={{ accentColor: "black" }}
                        />
                      </div>
                      <label
                        htmlFor={`status-${status || "all"}`}
                        className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                      >
                        {status === ""
                          ? "All"
                          : status.charAt(0).toUpperCase() + status.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
