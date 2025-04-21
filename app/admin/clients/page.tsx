"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import ClientAdd from "@/components/Admin/ClientAdd"; // You'll need to create this component

interface client_table {
  client_id: number;
  name: string;
  address: string;
  phone_no: string;
  status?: string;
  client_auth: {
    email: string;
  };
}

export default function Home() {
  const [clientList, setClientList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false); // Add this state

  // Create a function to fetch clients
  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/client");
      const data = await res.json();
      console.log("Fetched client data:", data);

      // Filter out "PAST CLIENT" clients
      const activeClients = data.filter(
        (client: client_table) => client.status !== "PAST CLIENT"
      );

      setClientList(activeClients);
    } catch (err) {
      console.error("Error fetching clients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
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
    <div className="bg-white min-h-screen p-4 md:p-8 flex flex-col md:grid md:grid-cols-2 md:grid-rows-1 gap-6">
      {/* Mobile search - visible only on small screens */}
      <div className="md:hidden mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Client Overview
        </h1>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Find Clients
          </h3>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search Clients"
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

          {/* Add Client button for mobile */}
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            + Add New Client
          </button>
        </div>
      </div>

      {/* Left side: Client list */}
      <div className="md:pr-4 overflow-y-auto order-2 md:order-1">
        <h1 className="hidden md:block text-3xl font-bold text-gray-800 mb-6 pl-2">
          Client Overview
        </h1>

        <div className="md:pl-12">
          {loading ? (
            <p className="text-center py-4">Loading clients...</p>
          ) : filteredClientList.length === 0 ? (
            <div className="text-center py-4">
              <p>No clients match your search.</p>
              <p className="text-sm text-gray-500 mt-2">
                Try a different search term or check the browser console for
                debugging info.
              </p>
            </div>
          ) : (
            filteredClientList.map((client: client_table) => (
              <div
                key={client.client_id}
                className="grid grid-cols-1 grid-rows-2 mb-6 md:mb-8 p-3 rounded-lg hover:bg-gray-50"
              >
                <Link href={`/admin/clients/${client.client_id}`}>
                  <div>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                      {client.name}{" "}
                    </h2>
                  </div>
                </Link>
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
                  <hr className="w-full md:w-[90%]" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right side: Search component - visible only on desktop */}
      <div className="hidden md:block relative order-1 md:order-2">
        <div className="sticky top-[30%] left-0 flex justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Find Clients
            </h3>

            {/* Search Input */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Clients"
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

            {/* Add Client button for desktop */}
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-6 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
            >
              + Add New Client
            </button>
          </div>
        </div>
      </div>

      {/* Modal for adding a new client */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <ClientAdd
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              fetchClients(); // Refresh the client list
              setShowAddModal(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
