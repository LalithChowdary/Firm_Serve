"use client";
import React, { useState, useEffect } from "react";

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

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/case")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched case data:", data);

        // Log the first case to see actual field names
        if (data && data.length > 0) {
          console.log("First case fields:", Object.keys(data[0]));
        }

        setCaseList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching Cases:", err);
        setLoading(false);
      });
  }, []);

  const filteredCaseList = caseList.filter((cases: case_table) => {
    console.log("Case object:", cases); // Log each case object
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
    <div className="bg-white min-h-screen p-8 grid grid-cols-2 grid-rows-1 ">
      {/* Left side: Cases list */}
      <div className="pr-4 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 pl-2">
          Cases Overview
        </h1>

        <div className="pl-12">
          {loading ? (
            <p>Loading cases...</p>
          ) : filteredCaseList.length === 0 ? (
            <>
              <p>No Cases match your filters.</p>
              <p className="text-sm text-gray-500 mt-2">
                Try clearing filters or checking the browser console for
                debugging info.
              </p>
            </>
          ) : (
            filteredCaseList.map((cases: case_table) => (
              <div
                key={cases.case_id}
                className="grid grid-cols-1 grid-rows-2 mb-8"
              >
                <div>
                  <h2 className="text-[22px] font-semibold text-gray-900">
                    {cases.title}{" "}
                  </h2>
                </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
