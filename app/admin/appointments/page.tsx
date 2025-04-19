"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface appointments_table {
  appointment_id: string;
  appointment_date: Date;
  purpose: string;
  location: string;
  Appointment_Client?: {
    Client?: {
      name: string;
    };
  }[];
  Cases?: {
    title: string;
  };
}

export default function Home() {
  const [appointmentList, setAppointmentList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/appointments")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched staff data:", data);

        setAppointmentList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching appointments:", err);
        setLoading(false);
      });
  }, []);

  const filteredAppointmentsList = appointmentList.filter(
    (appoin: appointments_table) => {
      // Search term filter
      const matchesSearch =
        searchTerm === "" ||
        (appoin.purpose &&
          appoin.purpose.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (appoin.Cases?.title &&
          appoin.Cases.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        // Check if any client name matches
        appoin.Appointment_Client?.some((clientCase) =>
          clientCase.Client?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
        );

      return matchesSearch;
    }
  );

  return (
    <div className="bg-white min-h-screen p-4 md:p-8">
      {/* Mobile search - visible only on small screens */}
      <div className="md:hidden mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Appointments Overview
        </h1>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Find Appointment
          </h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Appointments"
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
        </div>
      </div>

      {/* Desktop layout - grid for larger screens */}
      <div className="flex flex-col md:grid md:grid-cols-2 md:grid-rows-1 gap-6">
        {/* Left side: Appointments list */}
        <div className="md:pr-4 overflow-y-auto">
          <h1 className="hidden md:block text-3xl font-bold text-gray-800 mb-6 pl-2">
            Appointments Overview
          </h1>

          <div className="md:pl-12">
            {loading ? (
              <p className="text-center py-4">Loading Appointments...</p>
            ) : filteredAppointmentsList.length === 0 ? (
              <div className="text-center py-4">
                <p>No Appointments match your filters.</p>
                <p className="text-sm text-gray-500 mt-2">
                  Try clearing filters or checking the browser console for
                  debugging info.
                </p>
              </div>
            ) : (
              filteredAppointmentsList.map((appoin: appointments_table) => (
                <div
                  key={appoin.appointment_id}
                  className="grid grid-cols-1 grid-rows-2 mb-8"
                >
                  <Link href={`/admin/appointments/${appoin.appointment_id}`}>
                    <div>
                      <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                        {appoin.purpose}{" "}
                      </h2>
                    </div>
                  </Link>
                  <div className="flex flex-col ml-2 mt-[-6px]">
                    <div className="font-medium text-gray-700">
                      For the case {appoin.Cases?.title}
                    </div>
                    <div className="font-medium text-gray-700">
                      Location {appoin.location}
                    </div>
                    <div className="font-medium text-gray-700">
                      Date{" "}
                      {new Date(appoin.appointment_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
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

        {/* Right side: Search component - visible only on desktop */}
        <div className="hidden md:block relative">
          <div className="sticky top-[30%] left-0 flex justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5 w-full max-w-md">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Find Appointment
              </h3>

              {/* Search Input */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Appointments"
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
    </div>
  );
}
