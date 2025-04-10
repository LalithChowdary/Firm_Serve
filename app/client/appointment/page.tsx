"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ClientAppointments() {
  const { data: session, status } = useSession();
  const [appointmentList, setAppointmentList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === "loading") return;

    setLoading(true);
    fetch("/api/client/appointment")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API returned ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched client appointments:", data);
        setAppointmentList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching appointments:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [status]);

  const filteredAppointmentsList = appointmentList.filter((appoin: any) => {
    // Search term filter
    const matchesSearch =
      searchTerm === "" ||
      (appoin.purpose &&
        appoin.purpose.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (appoin.Cases?.title &&
        appoin.Cases.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      // Check if any staff name matches
      appoin.Appointment_Staff?.some((staffAppointment: any) =>
        staffAppointment.Staff?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );

    return matchesSearch;
  });

  // Display loading or authentication states
  if (status === "loading") {
    return <p className="p-8">Loading session...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <p className="p-8">You must be signed in to view your appointments.</p>
    );
  }

  return (
    <div className="bg-white min-h-screen p-8 grid grid-cols-2 grid-rows-1 ">
      {/* Left side: Appointments list */}
      <div className="pr-4 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 pl-2">
          Your Appointments
        </h1>

        <div className="pl-12">
          {loading ? (
            <p>Loading Appointments...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : filteredAppointmentsList.length === 0 ? (
            <>
              <p>No Appointments match your filters.</p>
              <p className="text-sm text-gray-500 mt-2">
                Try clearing filters or contact your lawyer.
              </p>
            </>
          ) : (
            filteredAppointmentsList.map((appoin: any) => (
              <div
                key={appoin.appointment_id}
                className="grid grid-cols-1 grid-rows-2 mb-8"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {appoin.purpose}
                  </h2>
                </div>
                <div className="flex flex-col ml-2 mt-[-6px]">
                  <div className="font-medium text-gray-700">
                    Case: {appoin.Cases?.title || "N/A"}
                  </div>
                  <div className="font-medium text-gray-700">
                    Location: {appoin.location}
                  </div>
                  <div className="font-medium text-gray-700">
                    Date: {new Date(appoin.appointment_date).toLocaleString()}
                  </div>

                  {/* Display staff information
                  {appoin.Appointment_Staff &&
                  appoin.Appointment_Staff.length > 0 ? (
                    <div className="font-medium text-gray-700 mt-2">
                      Lawyer(s):{" "}
                      {appoin.Appointment_Staff.map(
                        (as: any) => as.Staff?.name
                      ).join(", ")}
                    </div>
                  ) : (
                    <div className="font-medium text-gray-500 mt-2">
                      No staff assigned
                    </div>
                  )} */}
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
  );
}
