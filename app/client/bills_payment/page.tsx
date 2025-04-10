"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface billing_table {
  billing_id: number;
  amount: number;
  payment_date: string;
  due_date: string;
  payment_mode: string;
  status: string;
  Cases?: {
    title: string;
  };
}

export default function ClientBilling() {
  const { status } = useSession();
  const [billingList, setBillingList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "loading") return;

    setLoading(true);
    fetch("/api/client/bills_payment")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API returned ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched client billing:", data);
        setBillingList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching billing:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [status]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const filteredBillingList = billingList.filter((bill: billing_table) => {
    // Search term filter
    const matchesSearch =
      searchTerm === "" ||
      (bill.Cases?.title &&
        bill.Cases.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (bill.payment_mode &&
        bill.payment_mode.toLowerCase().includes(searchTerm.toLowerCase()));

    // Status filter - added null check
    const billStatus = (bill.status || "").toLowerCase();
    const matchesStatus =
      selectedStatus === "" || billStatus === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  // Get bill status safely
  const getBillStatus = (bill: billing_table) => {
    return (bill.status || "unknown").toLowerCase();
  };

  // Display loading or authentication states
  if (status === "loading") {
    return <p className="p-8">Loading session...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <p className="p-8">
        You must be signed in to view your billing information.
      </p>
    );
  }

  return (
    <div className="bg-white min-h-screen p-8 grid grid-cols-2 grid-rows-1">
      {/* Left side: Billing list */}
      <div className="pr-4 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 pl-2">
          Your Billing & Payments
        </h1>

        <div className="pl-12">
          {loading ? (
            <p>Loading billing information...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : filteredBillingList.length === 0 ? (
            <>
              <p>No billing records match your filters.</p>
              <p className="text-sm text-gray-500 mt-2">
                Try clearing filters or contact your lawyer.
              </p>
            </>
          ) : (
            filteredBillingList.map((bill: billing_table) => {
              const billStatus = getBillStatus(bill);
              return (
                <div
                  key={bill.billing_id}
                  className="grid grid-cols-1 grid-rows-2 mb-8"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-[22px] font-semibold text-gray-900">
                      {formatCurrency(Number(bill.amount || 0))}
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        billStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {bill.status || "Unknown"}
                    </span>
                  </div>
                  <div className="flex flex-col ml-2 mt-[-6px]">
                    <div className="font-medium text-gray-700">
                      Case: {bill.Cases?.title || "N/A"}
                    </div>
                    <div className="font-medium text-gray-700">
                      Payment Mode: {bill.payment_mode || "N/A"}
                    </div>
                    <div className="font-medium text-gray-700">
                      Payment Date:{" "}
                      {bill.payment_date
                        ? new Date(bill.payment_date).toLocaleDateString()
                        : "N/A"}
                    </div>
                    <div className="font-medium text-gray-700">
                      Due Date:{" "}
                      {bill.due_date
                        ? new Date(bill.due_date).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                  <div className="mt-6 mb-[-10px]">
                    <hr className="w-[70%]" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right side: Fixed search component */}
      <div className="relative">
        <div className="sticky top-[30%] bottom- left-0 flex justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Filter Payments
            </h3>

            {/* Search Input */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by case or payment mode"
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

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Status
              </label>
              <div className="space-y-2">
                {["", "paid", "pending"].map((status) => (
                  <div className="flex items-center" key={status || "all"}>
                    <div className="relative flex items-center mr-2">
                      <input
                        type="radio"
                        id={`status-${status || "all"}`}
                        name="paymentStatus"
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

            {/* Total Summary */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Total Paid:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(
                    filteredBillingList
                      .filter((bill) => getBillStatus(bill) === "paid")
                      .reduce(
                        (sum, bill: billing_table) =>
                          sum + Number(bill.amount || 0),
                        0
                      )
                  )}
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-sm font-medium text-gray-700">
                  Total Pending:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(
                    filteredBillingList
                      .filter((bill) => getBillStatus(bill) === "pending")
                      .reduce(
                        (sum, bill: billing_table) =>
                          sum + Number(bill.amount || 0),
                        0
                      )
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
