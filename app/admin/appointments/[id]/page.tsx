"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";

interface Client {
  client_id: string;
  name: string;
  phone_no: string;
  address?: string;
  image?: string;
}

interface Staff {
  staff_id: string;
  name: string;
  phone_no: string;
  address?: string;
  s_role?: string;
  image?: string;
}

interface Case {
  case_id: string;
  title?: string;
  court_name?: string;
  case_type?: string;
  status?: string;
  filing_date?: string;
}

interface AppointmentData {
  appointment_id: string;
  purpose: string;
  location: string;
  appointment_date: string; // ISO string from API
  notes?: string;
  Appointment_Client?: {
    Client: Client;
  }[];
  Appointment_Staff?: {
    Staff: Staff;
  }[];
  Cases?: Case[];
}

// --- DetailItem Component ---
interface DetailItemProps {
  label: string;
  value: string | undefined;
  icon: string;
}
function DetailItem({ label, value, icon }: DetailItemProps) {
  return (
    <div className="flex items-center">
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
        <span className="text-gray-600 text-sm">{icon}</span>
      </div>
      <div className="ml-3">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-gray-900">{value ?? "N/A"}</p>
      </div>
    </div>
  );
}

// --- Main Page ---
export default function AppointmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [appointmentData, setAppointmentData] =
    useState<AppointmentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`/api/admin/appointments/${id}`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();

        // Set the appointment data
        setAppointmentData(data);
      } catch (error) {
        console.log(error);
        setAppointmentData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-gray-800 mb-4"></div>
          <p className="text-gray-600">Loading appointment information...</p>
        </div>
      </div>
    );
  }

  if (!appointmentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white shadow-xl rounded-lg">
          <p className="text-2xl text-gray-800 font-semibold">
            Appointment not found
          </p>
          <p className="text-gray-600 mt-2">
            The requested appointment does not exist or was removed.
          </p>
        </div>
      </div>
    );
  }

  const clients =
    appointmentData?.Appointment_Client?.map((ac) => ac.Client) || [];
  const staffList =
    appointmentData?.Appointment_Staff?.map((as) => as.Staff) || [];
  const formattedDate = appointmentData?.appointment_date
    ? new Date(appointmentData.appointment_date).toLocaleString()
    : "N/A";

  // Convert the "Cases" object to an array (your database always returns "Cases"):
  const rawCases = appointmentData?.Cases || [];
  const cases = Array.isArray(rawCases) ? rawCases : [rawCases];

  // Debug section - will help you see what's coming from the API

  console.log("Cases found:", cases);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Card container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header with subtle gradient */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 h-32"></div>

          {/* Content area with negative margin to overlap header */}
          <div className="relative px-6 pb-8 -mt-16">
            {/* Appointment Title */}
            <div className="flex flex-col md:flex-row mb-8">
              <div className="flex-shrink-0 mb-4 md:mb-0">
                <div className="h-36 w-36 mx-auto md:mx-0 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-4xl">📅</span>
                </div>
              </div>
              <div className="md:ml-8 text-center md:text-left mt-4">
                <h1 className="text-3xl font-bold text-white mt-4">
                  {appointmentData.purpose}
                </h1>
              </div>
            </div>

            {/* Details section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <DetailItem
                label="Location"
                value={appointmentData.location}
                icon="📍"
              />
              <DetailItem label="Date & Time" value={formattedDate} icon="🕒" />
              <DetailItem
                label="Notes"
                value={appointmentData.notes || "No additional notes"}
                icon="📝"
              />
            </div>

            {/* Associated Clients */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Associated Clients
              </h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {clients.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Address
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {clients.map((client) => (
                          <tr
                            key={client.client_id}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                              <div className="flex items-center">
                                {client.image ? (
                                  <Image
                                    src={client.image}
                                    alt={client.name}
                                    width={32}
                                    height={32}
                                    className="rounded-full mr-2"
                                  />
                                ) : (
                                  <span className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mr-2">
                                    {client.name.charAt(0)}
                                  </span>
                                )}
                                {client.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {client.phone_no}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {client.address ?? "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No clients associated with this appointment
                  </p>
                )}
              </div>
            </div>

            {/* Associated Staff */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Associated Staff
              </h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {staffList.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {staffList.map((staff) => (
                          <tr key={staff.staff_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                              <div className="flex items-center">
                                {staff.image ? (
                                  <Image
                                    src={staff.image}
                                    alt={staff.name}
                                    width={32}
                                    height={32}
                                    className="rounded-full mr-2"
                                  />
                                ) : (
                                  <span className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mr-2">
                                    {staff.name.charAt(0)}
                                  </span>
                                )}
                                {staff.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {staff.phone_no}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {staff.s_role ?? "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No staff associated with this appointment
                  </p>
                )}
              </div>
            </div>

            {/* Associated Cases */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Associated Cases
              </h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Court
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cases.map((caseItem) => (
                        <tr key={caseItem.case_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            {caseItem.title || "Untitled Case"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {caseItem.court_name || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {caseItem.case_type || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {caseItem.status || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
