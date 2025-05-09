"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import CaseAdd from "@/components/Admin/CaseAdd"; // We'll create this component

interface case_table {
  case_id: number;
  title: string;
  case_type: string;
  status: string;
  Client_Case: {
    Client: {
      client_auth: {
        email: string;
      };
      name: string;
    };
  }[];
}

export default function Home() {
  const [caseList, setCaseList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCaseType, setSelectedCaseType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false); // New state for modal

  // Function to fetch cases
  const fetchCases = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/case");
      const data = await res.json();
      console.log("Fetched case data:", data);

      // Filter out INACTIVE cases here
      const activeCases = data.filter(
        (item: case_table) => item.status !== "INACTIVE"
      );

      setCaseList(activeCases);
    } catch (err) {
      console.error("Error fetching Cases:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const filteredCaseList = caseList.filter((cases: case_table) => {
    // Search term filter
    const matchesSearch =
      searchTerm === "" ||
      (cases.title &&
        cases.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (cases.Client_Case?.[0]?.Client?.name &&
        cases.Client_Case[0].Client.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    // Case type filter
    let matchesType = selectedCaseType === "";
    if (!matchesType && cases.case_type) {
      matchesType = cases.case_type
        .toLowerCase()
        .includes(selectedCaseType.toLowerCase());
    }

    // Status filter
    let matchesStatus = selectedStatus === "";
    if (!matchesStatus && cases.status) {
      matchesStatus = cases.status
        .toLowerCase()
        .includes(selectedStatus.toLowerCase());
    }

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCaseTypeChange = (Type: string) => {
    console.log("Setting Case Type to:", Type);
    setSelectedCaseType(Type);
  };

  const handleStatusChange = (Status: string) => {
    console.log("Setting status to:", Status);
    setSelectedStatus(Status);
  };

  return (
    <div className="bg-white min-h-screen p-4 md:p-8 flex flex-col md:grid md:grid-cols-2 md:grid-rows-1 gap-6">
      {/* Mobile search - visible only on small screens */}
      <div className="md:hidden mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Cases Overview
        </h1>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Find Case
          </h3>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search Cases"
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
          <div className="grid grid-cols-2 gap-4">
            {/* Case Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Case Type
              </label>
              <div className="space-y-1">
                {["", "criminal", "civil", "corporate"].map((spec) => (
                  <div className="flex items-center" key={spec || "all"}>
                    <div className="relative flex items-center mr-2">
                      <input
                        type="radio"
                        id={`spec-mobile-${spec || "all"}`}
                        name="specialization-mobile"
                        value={spec}
                        checked={selectedCaseType === spec}
                        onChange={() => handleCaseTypeChange(spec)}
                        className="appearance-none w-4 h-4 rounded-full border border-black checked:bg-black checked:border-black focus:ring-0 focus:outline-none focus:border-black"
                        style={{ accentColor: "black" }}
                      />
                    </div>
                    <label
                      htmlFor={`spec-mobile-${spec || "all"}`}
                      className="text-xs text-gray-700 cursor-pointer"
                    >
                      {spec === ""
                        ? "All"
                        : spec.charAt(0).toUpperCase() + spec.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="space-y-1">
                {["", "open", "closed"].map((role) => (
                  <div className="flex items-center" key={role || "all"}>
                    <div className="relative flex items-center mr-2">
                      <input
                        type="radio"
                        id={`role-mobile-${role || "all"}`}
                        name="role-mobile"
                        value={role}
                        checked={selectedStatus === role}
                        onChange={() => handleStatusChange(role)}
                        className="appearance-none w-4 h-4 rounded-full border border-black checked:bg-black checked:border-black focus:ring-0 focus:outline-none focus:border-black"
                        style={{ accentColor: "black" }}
                      />
                    </div>
                    <label
                      htmlFor={`role-mobile-${role || "all"}`}
                      className="text-xs text-gray-700 cursor-pointer"
                    >
                      {role === ""
                        ? "All"
                        : role.charAt(0).toUpperCase() + role.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add Case button for mobile */}
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            + Add New Case
          </button>
        </div>
      </div>

      {/* Left side: Cases list */}
      <div className="md:pr-4 overflow-y-auto order-2 md:order-1">
        <h1 className="hidden md:block text-3xl font-bold text-gray-800 mb-6 pl-2">
          Cases Overview
        </h1>

        <div className="md:pl-12">
          {loading ? (
            <p className="text-center py-4">Loading cases...</p>
          ) : filteredCaseList.length === 0 ? (
            <div className="text-center py-4">
              <p>No Cases match your filters.</p>
              <p className="text-sm text-gray-500 mt-2">
                Try clearing filters or checking the browser console for
                debugging info.
              </p>
            </div>
          ) : (
            filteredCaseList.map((cases: case_table) => (
              <div
                key={cases.case_id}
                className="grid grid-cols-1 grid-rows-2 mb-6 md:mb-8 p-3 rounded-lg hover:bg-gray-50"
              >
                <Link href={`/admin/cases/${cases.case_id}`}>
                  <div>
                    <h2 className="text-lg md:text-[22px] font-semibold text-gray-900">
                      {cases.title}{" "}
                    </h2>
                  </div>
                </Link>
                <div className="flex flex-col ml-2 mt-[-12px]">
                  <div className="font-medium text-gray-700">
                    Type: {cases.case_type}
                  </div>
                  <div className="font-medium text-gray-700">
                    Status: {cases.status}
                  </div>
                  <div className="font-medium text-gray-700">
                    Email:{" "}
                    {cases.Client_Case?.[0]?.Client?.client_auth?.email ||
                      "N/A"}
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

      {/* Right side: Search component - visible only on desktop */}
      <div className="hidden md:block relative order-1 md:order-2">
        <div className="sticky top-[30%] left-0 flex justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Find Case
            </h3>

            {/* Search Input */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Cases"
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
              {/* Case Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Case Type
                </label>
                <div className="space-y-2">
                  {["", "criminal", "civil", "corporate"].map((spec) => (
                    <div className="flex items-center" key={spec || "all"}>
                      <div className="relative flex items-center mr-2">
                        <input
                          type="radio"
                          id={`spec-${spec || "all"}`}
                          name="specialization"
                          value={spec}
                          checked={selectedCaseType === spec}
                          onChange={() => handleCaseTypeChange(spec)}
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
                          : spec.charAt(0).toUpperCase() +
                            spec.slice(1) +
                            " Law"}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <div className="space-y-2">
                  {["", "open", "closed"].map((role) => (
                    <div className="flex items-center" key={role || "all"}>
                      <div className="relative flex items-center mr-2">
                        <input
                          type="radio"
                          id={`role-${role || "all"}`}
                          name="role"
                          value={role}
                          checked={selectedStatus === role}
                          onChange={() => handleStatusChange(role)}
                          className="appearance-none w-4 h-4 rounded-full border border-black checked:bg-black checked:border-black focus:ring-0 focus:outline-none focus:border-black"
                          style={{ accentColor: "black" }}
                        />
                      </div>
                      <label
                        htmlFor={`role-${role || "all"}`}
                        className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                      >
                        {role === ""
                          ? "All"
                          : role.charAt(0).toUpperCase() + role.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Add Case button for desktop */}
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-6 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
            >
              + Add New Case
            </button>
          </div>
        </div>
      </div>

      {/* Modal for adding a new case */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <CaseAdd
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              fetchCases(); // Refresh the case list
              setShowAddModal(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
