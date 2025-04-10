"use client";
import React, { useState, useEffect } from "react";

interface client_table {
  client_id: number;
  name: string;
  address: string;
  phone_no: string;
  client_auth: {
    email: string;
  };
}

export default function Home() {
  const [clientList, setClientList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/client")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched staff data:", data);

        // Log the first staff member to see actual field names
        if (data && data.length > 0) {
          console.log("First client member fields:", Object.keys(data[0]));
        }

        setClientList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching staff:", err);
        setLoading(false);
      });
  }, []);

  const filteredClientList = clientList.filter((client: client_table) => {
    // Search term filter
    const matchesSearch =
      searchTerm === "" ||
      (client.name &&
        client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.client_auth?.email &&
        client.client_auth.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  return (
    <div className="bg-white min-h-screen p-8 grid grid-cols-2 grid-rows-1 ">
      {/* Left side: Staff list */}
      <div className="pr-4 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 pl-2">
          Client Overview
        </h1>

        <div className="pl-12">
          {" "}
          {/* Added padding container for all staff cards */}
          {loading ? (
            <p>Loading client...</p>
          ) : filteredClientList.length === 0 ? (
            <>
              <p>No staff members match your filters.</p>
              <p className="text-sm text-gray-500 mt-2">
                Try clearing filters or checking the browser console for
                debugging info.
              </p>
            </>
          ) : (
            filteredClientList.map((client: client_table) => (
              <div
                key={client.client_id}
                className="grid grid-cols-1 grid-rows-2 mb-8"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {client.name}{" "}
                  </h2>
                </div>
                <div className="flex flex-col ml-2 mt-[-13px]">
                  <div className="font-medium text-gray-700">
                    Address {client.address}
                  </div>
                  <div className="font-medium text-gray-700">
                    Email {client.client_auth?.email}
                  </div>
                  <div className="font-medium text-gray-700">
                    Phone {client.phone_no}
                  </div>
                </div>
                <div className="mt-6 mb-[-10px]">
                  <hr className="w-[90%]" />
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
              Find Clients
            </h3>

            {/* Search Input */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Staff"
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
          </div>
        </div>
      </div>
    </div>
  );
}
