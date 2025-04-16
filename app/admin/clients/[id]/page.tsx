"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";

interface StaffUser {
  email: string;
}

interface ClientTable {
  client_id: string;
  name: string;
  phone_no: string;
  address: string;
  image?: string;
  client_auth: StaffUser;
  Client_Case?: Array<{
    Cases?: {
      case_id: string;
      title: string;
      status: string;
      next_hearing_date?: Date;
      Staff_Case?: Array<{
        Staff: {
          staff_id: string;
          name: string;
          phone_no: string;
          s_role?: string;
        };
      }>;
    };
  }>;
  Appointment_Client?: Array<{
    Appointment?: {
      appointment_date?: string;
      purpose?: string;
      location?: string;
      Appointment_Staff?: Array<{
        Staff: {
          staff_id: string;
          name: string;
          phone_no: string;
          s_role?: string;
        };
      }>;
    };
  }>;
}

export default function Staffinfo({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [client, setclient] = useState<ClientTable | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("Fetching client with ID:", id);
    fetch(`/api/admin/client/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        return res.json();
      })
      .then((data: ClientTable) => {
        console.log("API response:", data);
        setclient(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-gray-800 mb-4"></div>
          <p className="text-gray-600">Loading staff information...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white shadow-xl rounded-lg">
          <p className="text-2xl text-gray-800 font-semibold">
            Staff not found
          </p>
          <p className="text-gray-600 mt-2">
            The requested staff profile does not exist or was removed.
          </p>
        </div>
      </div>
    );
  }

  // Build a unique list of all staff
  const staffFromCases =
    client.Client_Case?.flatMap(
      (cCase) => cCase.Cases?.Staff_Case?.map((sCase) => sCase.Staff) || []
    ) || [];

  const staffFromAppointments =
    client.Appointment_Client?.flatMap(
      (aClient) =>
        aClient.Appointment?.Appointment_Staff?.map((aStaff) => aStaff.Staff) ||
        []
    ) || [];

  const allStaff = [...staffFromCases, ...staffFromAppointments];
  // Remove duplicates by staff_id
  const uniqueStaff = Array.from(
    new Map(allStaff.map((s) => [s.staff_id, s])).values()
  );

  return (
    <div className=" min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Card container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header with subtle gradient */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 h-32"></div>

          {/* Content area with negative margin to overlap header */}
          <div className="relative px-6 pb-8 -mt-16">
            {/* Profile section with image and name */}
            <div className="flex flex-col md:flex-row mb-8">
              <div className="flex-shrink-0 mb-4 md:mb-0">
                <div className="h-36 w-36 mx-auto md:mx-0 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {client.image ? (
                    <Image
                      src={client.image}
                      alt={`Photo of ${client.name}`}
                      className="h-full w-full object-cover object-top"
                      width={144}
                      height={144}
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-2xl">
                        {client.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:ml-8 text-center md:text-left mt-4">
                <h1 className="text-3xl font-bold text-white mt-4">
                  {client.name}
                </h1>
              </div>
            </div>

            {/* Details section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <DetailItem
                label="Experience"
                value={`${client.phone_no} `}
                icon="📊"
              />

              <DetailItem
                label="Email"
                value={client.client_auth?.email || "N/A"}
                icon="📧"
              />

              <DetailItem label="Address" value={client.address} icon="📍" />
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                All Cases
              </h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {client.Client_Case && client.Client_Case.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Filing Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {client.Client_Case.map((clientCase, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {clientCase.Cases?.title ?? "Untitled Case"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${
                                  clientCase.Cases?.status === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : clientCase.Cases?.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : clientCase.Cases?.status === "Closed"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {clientCase.Cases?.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {clientCase.Cases?.next_hearing_date
                                ? new Date(
                                    clientCase.Cases?.next_hearing_date
                                  ).toLocaleDateString()
                                : "Not scheduled"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No cases found
                  </p>
                )}
              </div>
            </div>

            <div className="mt-12 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                All Appointments
              </h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {client.Appointment_Client &&
                client.Appointment_Client.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {client.Appointment_Client.map((app, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {app.Appointment?.purpose ?? "Untitled"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {app.Appointment?.appointment_date
                                ? new Date(
                                    app.Appointment.appointment_date
                                  ).toLocaleDateString()
                                : "No date"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {app.Appointment?.appointment_date
                                ? new Date(
                                    app.Appointment.appointment_date
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  })
                                : "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {app.Appointment?.location ?? "Unknown"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No appointments found
                  </p>
                )}
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                All Staff
              </h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {uniqueStaff.length > 0 ? (
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
                        {uniqueStaff.map((staff) => (
                          <tr key={staff.staff_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {staff.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {staff.phone_no}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {staff.s_role || "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No staff found for this client
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DetailItemProps {
  label: string;
  value: string;
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
        <p className="font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
