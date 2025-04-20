"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import StaffAdd from "@/components/Admin/StaffAdd";

interface Staff_Table {
  staff_id: string;
  name: string;
  experience: number;
  phone_no: string;
  bar_number?: string;
  address: string;
  specialisation?: string;
  s_role: string;
  designation?: string;
  image?: string;
  status?: string;
  staff_auth?: {
    email: string;
  };
}

export default function Home() {
  const [staffList, setStaffList] = useState<Staff_Table[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/staff");
      const data: Staff_Table[] = await res.json();
      setStaffList(data);
    } catch (err) {
      console.error("Error fetching staff:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const filteredStaffList = staffList.filter((staff: Staff_Table) => {
    if (staff.status === "not working") {
      return false;
    }

    const matchesSearch =
      searchTerm === "" ||
      (staff.name &&
        staff.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (staff.staff_auth?.email &&
        staff.staff_auth.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

    let matchesSpec = selectedSpecialization === "";
    if (!matchesSpec && staff.specialisation) {
      matchesSpec = staff.specialisation
        .toLowerCase()
        .includes(selectedSpecialization.toLowerCase());
    }

    let matchesRole = selectedRole === "";
    if (!matchesRole && staff.s_role) {
      matchesRole = staff.s_role
        .toLowerCase()
        .includes(selectedRole.toLowerCase());
    }

    return matchesSearch && matchesSpec && matchesRole;
  });

  const handleSpecializationChange = (spec: string) => {
    setSelectedSpecialization(spec);
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
  };

  return (
    <div className="bg-white min-h-screen p-4 md:p-8 flex flex-col md:grid md:grid-cols-2 gap-6">
      {/* Mobile search - visible only on small screens */}
      <div className="md:hidden mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Staff Overview
        </h1>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Find Staff
          </h3>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search Staff"
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
            {/* Specialization */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialization
              </label>
              <div className="space-y-1">
                {["", "criminal", "family", "corporate"].map((spec) => (
                  <div className="flex items-center" key={spec || "all"}>
                    <div className="relative flex items-center mr-2">
                      <input
                        type="radio"
                        id={`spec-mobile-${spec || "all"}`}
                        name="specialization-mobile"
                        value={spec}
                        checked={selectedSpecialization === spec}
                        onChange={() => handleSpecializationChange(spec)}
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

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <div className="space-y-1">
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
                        id={`role-mobile-${role || "all"}`}
                        name="role-mobile"
                        value={role.toLowerCase()}
                        checked={selectedRole === role.toLowerCase()}
                        onChange={() => handleRoleChange(role.toLowerCase())}
                        className="appearance-none w-4 h-4 rounded-full border border-black checked:bg-black checked:border-black focus:ring-0 focus:outline-none focus:border-black"
                        style={{ accentColor: "black" }}
                      />
                    </div>
                    <label
                      htmlFor={`role-mobile-${role || "all"}`}
                      className="text-xs text-gray-700 cursor-pointer"
                    >
                      {role === "" ? "All" : role}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            + Add New Staff
          </button>
        </div>
      </div>

      {/* Left side: Staff list */}
      <div className="md:pr-4 overflow-y-auto order-2 md:order-1">
        <h1 className="hidden md:block text-3xl font-bold text-gray-800 mb-6 pl-2">
          Staff Overview
        </h1>

        <div className="md:pl-12">
          {loading ? (
            <p className="text-center py-4">Loading staff...</p>
          ) : filteredStaffList.length === 0 ? (
            <div className="text-center py-4">
              <p>No staff members match your filters.</p>
              <p className="text-sm text-gray-500 mt-2">
                Try clearing filters or checking the browser console for
                debugging info.
              </p>
            </div>
          ) : (
            filteredStaffList.map((staff: Staff_Table) => (
              <div
                key={staff.staff_id}
                className="grid grid-cols-1 grid-rows-2 mb-6 md:mb-8 p-3 rounded-lg hover:bg-gray-50"
              >
                <div>
                  <Link href={`/admin/staff/${staff.staff_id}`}>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                      {staff.name}{" "}
                      <span className="text-xs text-gray-500 mt-[-5px] ml-[-6px]">
                        {staff.designation}
                      </span>
                    </h2>
                  </Link>
                </div>
                <div className="flex flex-col ml-2 mt-[-6px]">
                  <div className="font-medium text-gray-700">
                    Specialised in {staff.specialisation}
                  </div>
                  <div className="font-medium text-gray-700">
                    Email {staff.staff_auth?.email}
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
              Find Staff
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

            {/* Filters */}
            <div className="grid grid-cols-2 gap-6">
              {/* Specialization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Specialization
                </label>
                <div className="space-y-2">
                  {["", "criminal", "family", "corporate"].map((spec) => (
                    <div className="flex items-center" key={spec || "all"}>
                      <div className="relative flex items-center mr-2">
                        <input
                          type="radio"
                          id={`spec-${spec || "all"}`}
                          name="specialization"
                          value={spec}
                          checked={selectedSpecialization === spec}
                          onChange={() => handleSpecializationChange(spec)}
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

              {/* Role */}
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
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="mt-6 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
            >
              + Add New Staff
            </button>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <StaffAdd
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              fetchStaff();
              setShowAddModal(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
