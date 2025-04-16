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

interface Appointment {
  appointment_id: string;
  purpose: string;
  location: string;
  appointment_date: string; // ISO string from API
}

interface CaseTable {
  case_id?: string;
  title?: string;
  court_name?: string;
  verdict?: string;
  case_type?: string;
  status?: string;
  filing_date?: string;
  Client_Case?: {
    Client: Client;
  }[];
  Staff_Case?: {
    Staff: Staff;
  }[];
  Appointment?: Appointment[];
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
export default function CaseDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [caseData, setCaseData] = useState<CaseTable | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`/api/admin/case/${id}`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data: CaseTable = await response.json();
        setCaseData(data);
      } catch (error) {
        setCaseData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [params, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-gray-800 mb-4"></div>
          <p className="text-gray-600">Loading case information...</p>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white shadow-xl rounded-lg">
          <p className="text-2xl text-gray-800 font-semibold">Case not found</p>
          <p className="text-gray-600 mt-2">
            The requested case does not exist or was removed.
          </p>
        </div>
      </div>
    );
  }

  const clients = caseData.Client_Case?.map((cc) => cc.Client) || [];
  const staffList = caseData.Staff_Case?.map((sc) => sc.Staff) || [];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Card container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header with subtle gradient */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 h-32"></div>

          {/* Content area with negative margin to overlap header */}
          <div className="relative px-6 pb-8 -mt-16">
            {/* Case Title */}
            <div className="flex flex-col md:flex-row mb-8">
              <div className="flex-shrink-0 mb-4 md:mb-0">
                <div className="h-36 w-36 mx-auto md:mx-0 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-4xl">⚖️</span>
                </div>
              </div>
              <div className="md:ml-8 text-center md:text-left mt-4">
                <h1 className="text-3xl font-bold text-white mt-4">
                  {caseData.title}
                </h1>
              </div>
            </div>

            {/* Details section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <DetailItem label="Court" value={caseData.court_name} icon="🏛️" />
              <DetailItem label="Type" value={caseData.case_type} icon="📁" />
              <DetailItem label="Status" value={caseData.status} icon="📊" />
              <DetailItem
                label="Verdict"
                value={caseData.verdict || "N/A"}
                icon="⚖️"
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
                                  <span className="inline-block w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mr-2">
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
                    No clients associated with this case
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
                                  <span className="inline-block w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mr-2">
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
                    No staff associated with this case
                  </p>
                )}
              </div>
            </div>

            {/* Associated Appointments */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Associated Appointments
              </h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {caseData.Appointment && caseData.Appointment.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Purpose
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {caseData.Appointment.map((appt) => (
                          <tr
                            key={appt.appointment_id}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {appt.purpose}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {appt.location}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(appt.appointment_date).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No appointments associated with this case
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
