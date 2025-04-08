"use client";
import { match } from "assert";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [billingList, setBillingList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/billing")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Billing data:", data);

        // Log the first staff member to see actual field names
        if (data && data.length > 0) {
          console.log("First billing fields:", Object.keys(data[0]));
          console.log("Role value:", data[0].s_role);
        }

        setBillingList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching Billing data:", err);
        setLoading(false);
      });
  }, []);

  const filteredBillingList = billingList.filter((Bills: any) => {
    // Search term filter
    const matchesSearch =
      searchTerm === "" ||
      (Bills.Client.name &&
        Bills.Client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (Bills.amout &&
        Bills.amount.toLowerCase().includes(searchTerm.toLowerCase()));

    // Specialization filter
    let matchesBill = selectedStatus === "";
    if (!matchesBill && Bills.status) {
      matchesBill = Bills.status
        .toLowerCase()
        .includes(selectedStatus.toLowerCase());
    }

    return matchesSearch && matchesBill;
  });
  const handleStatusChange = (spec: string) => {
    console.log("Setting specialization to:", spec);
    setSelectedStatus(spec);
  };

  // const handleRoleChange = (role: string) => {
  //   console.log("Setting role to:", role);
  //   setSelectedRole(role);
  // };

  // Debug logging for state changes
  console.log("Current specialization:", selectedStatus);
  // console.log("Current role:", selectedRole);

  return (
    <div className="bg-white min-h-screen p-8 grid grid-cols-2 grid-rows-1 ">
      {/* Left side: Staff list */}
      <div className="pr-4 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 pl-2">
          Billing Overview
        </h1>

        <div className="pl-12">
          {" "}
          {/* Added padding container for all staff cards */}
          {loading ? (
            <p>Loading staff...</p>
          ) : filteredBillingList.length === 0 ? (
            <>
              <p>No Bills match your filters.</p>
              <p className="text-sm text-gray-500 mt-2">
                Try clearing filters or checking the browser console for
                debugging info.
              </p>
            </>
          ) : (
            filteredBillingList.map((Bills: any) => (
              <div
                key={Bills.Billing_id}
                className="grid grid-cols-1 grid-rows-2 mb-8"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {Bills.Client.name}{" "}
                  </h2>
                </div>
                <div className="flex flex-col ml-2 mt-[-13px]">
                  <div className="font-medium text-gray-700">
                    Amount {Bills.amount}
                  </div>
                  <div className="font-medium text-gray-700">
                    Status {Bills.status}
                  </div>
                  {Bills.status != "Paid" && (
                    <div className="font-medium text-gray-700">
                      Due date {Bills.Due_date}
                    </div>
                  )}
                </div>
                <div className="mt-6 mb-[-10px]">
                  <hr className="w-[70%]" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right side: Fixed search component */}
      <div className="relative">
        <div className="sticky top-[30%] bottom- left-0 flex justify-center">
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
            <div className="grid grid-cols-2 gap-6">
              {/* Specialization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Specialization
                </label>
                <div className="space-y-2">
                  {["", "Paid", "Pending"].map((spec) => (
                    <div className="flex items-center" key={spec || "all"}>
                      <div className="relative flex items-center mr-2">
                        <input
                          type="radio"
                          id={`spec-${spec || "all"}`}
                          name="specialization"
                          value={spec}
                          checked={selectedStatus === spec}
                          onChange={() => handleStatusChange(spec)}
                          className="appearance-none w-4 h-4 rounded-full border border-black checked:bg-black checked:border-black focus:ring-0 focus:outline-none focus:border-black"
                          style={{ accentColor: "black" }}
                        />
                      </div>
                      <label
                        htmlFor={`spec-${spec || "all"}`}
                        className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                      >
                        {spec === ""
                          ? "All"
                          : spec.charAt(0).toUpperCase() + spec.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Role
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <div className="space-y-2">
                  {[
                    "",
                    "Lawyer",
                    "Paralegal",
                    "Secretary",
                    "Accountant",
                    "IT Support",
                  ].map((role) => (
                    <div className="flex items-center" key={role || "all"}>
                      <div className="relative flex items-center mr-2">
                        <input
                          type="radio"
                          id={`role-${role || "all"}`}
                          name="role"
                          value={role.toLowerCase()}
                          checked={selectedRole === role.toLowerCase()}
                          onChange={() => handleRoleChange(role.toLowerCase())}
                          className="appearance-none w-4 h-4 rounded-full border border-black checked:bg-black checked:border-black focus:ring-0 focus:outline-none focus:border-black"
                          style={{ accentColor: "black" }}
                        />
                      </div>
                      <label
                        htmlFor={`role-${role || "all"}`}
                        className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                      >
                        {role === "" ? "All" : role}
                      </label>
                    </div>
                  ))}
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
