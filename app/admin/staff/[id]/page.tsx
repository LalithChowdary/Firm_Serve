"use client";

import React, { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import Staffedit from "@/components/Admin/Staffedit";
import Image from "next/image";

// Existing interface for Staff
interface StaffUser {
  email: string;
}

interface Staff {
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
  staff_auth?: StaffUser;
  cases?: {
    case_id: string;
    title: string;
    status: string;
    next_hearing_date?: Date;
  }[];
  appointments?: {
    appointment_id: string;
    title: string;
    date: string;
    time: string;
    location?: string;
    status: string;
  }[];
  clients?: {
    client_id: string;
    name: string;
    phone_no: string;
    address?: string;
    email?: string;
  }[];
}

// Interfaces for your API response
interface StaffCaseRel {
  Cases: {
    case_id: string;
    title: string;
    status: string;
    filing_date?: Date;
    Client_Case?: {
      Client: {
        client_id: string;
        name: string;
        phone_no: string;
        address: string;
        client_auth?: {
          email: string;
        };
      };
    }[];
  };
}

interface AppointmentStaffRel {
  Appointment: {
    appointment_id: string;
    purpose: string;
    appointment_date: string;
    location?: string;
  };
}

interface StaffAPIResponse {
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
  staff_auth?: StaffUser;
  Staff_Case?: StaffCaseRel[];
  Appointment_Staff?: AppointmentStaffRel[];
}

export default function Staffinfo({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Get the staff ID directly
  const { id } = use(params);
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editTerm, setEditTerm] = useState("False");

  // New state for delete/reassign modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  // Track selected staff or "delete" for each client
  const [clientAssignments, setClientAssignments] = useState<{
    [clientId: string]: string;
  }>({});
  const [allStaff, setAllStaff] = useState<Staff[]>([]);

  // Add a new state variable to store the original API response
  const [originalData, setOriginalData] = useState<StaffAPIResponse | null>(
    null
  );

  // Updated getClientCasesMap function that only returns cases where the staff member and client overlap
  const getClientCasesMap = (): Record<
    string,
    { case_id: string; title: string }[]
  > => {
    if (!staff?.clients || !originalData?.Staff_Case) return {};

    // Create a mapping of client IDs to their cases that are handled by this staff
    const clientCasesMap: Record<string, { case_id: string; title: string }[]> =
      {};

    // Initialize empty arrays for each client
    staff.clients.forEach((client) => {
      clientCasesMap[client.client_id] = [];
    });

    // For each staff case, find which clients are associated
    originalData.Staff_Case?.forEach((staffCase) => {
      // Extract client IDs from the Client_Case relationship
      staffCase.Cases.Client_Case?.forEach((clientCase) => {
        const clientId = clientCase.Client.client_id;
        // Only add this case if the client is in our map
        if (clientCasesMap[clientId]) {
          clientCasesMap[clientId].push({
            case_id: staffCase.Cases.case_id,
            title: staffCase.Cases.title,
          });
        }
      });
    });

    return clientCasesMap;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching staff with ID:", id);
        const response = await fetch(`/api/admin/staff/${id}`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        // Typed API response
        const data: StaffAPIResponse = await response.json();
        console.log("API response:", data);

        // Save the original API response
        setOriginalData(data);

        // Transform Staff_Case into cases[]
        const transformedCases =
          data.Staff_Case?.map((staffCase) => ({
            case_id: staffCase.Cases.case_id,
            title: staffCase.Cases.title,
            status: staffCase.Cases.status,
            next_hearing_date: staffCase.Cases.filing_date,
          })) || [];

        // Transform Appointment_Staff into appointments[]
        const transformedAppointments =
          data.Appointment_Staff?.map((staffAppointment) => ({
            appointment_id: staffAppointment.Appointment.appointment_id,
            title: staffAppointment.Appointment.purpose,
            date: new Date(
              staffAppointment.Appointment.appointment_date
            ).toLocaleDateString(),
            time: new Date(
              staffAppointment.Appointment.appointment_date
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            location: staffAppointment.Appointment.location,
            status: "Scheduled",
          })) || [];

        // Extract unique clients from cases
        const clientsMap = new Map();
        data.Staff_Case?.forEach((staffCase) => {
          staffCase.Cases.Client_Case?.forEach((clientCase) => {
            const client = clientCase.Client;
            if (!clientsMap.has(client.client_id)) {
              clientsMap.set(client.client_id, {
                client_id: client.client_id,
                name: client.name,
                phone_no: client.phone_no,
                address: client.address,
                email: client.client_auth?.email,
              });
            }
          });
        });
        const transformedClients = Array.from(clientsMap.values());

        // Build final Staff object
        const updatedStaff: Staff = {
          staff_id: data.staff_id,
          name: data.name,
          experience: data.experience,
          phone_no: data.phone_no,
          bar_number: data.bar_number,
          address: data.address,
          specialisation: data.specialisation,
          s_role: data.s_role,
          designation: data.designation,
          image: data.image,
          staff_auth: data.staff_auth,
          cases: transformedCases,
          appointments: transformedAppointments,
          clients: transformedClients,
        };

        setStaff(updatedStaff);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchAllStaff = async () => {
      try {
        const res = await fetch("/api/admin/staff"); // Endpoint listing all staff
        if (!res.ok) throw new Error("Error fetching all staff");
        const staffList = await res.json();
        setAllStaff(staffList);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAllStaff();
  }, []);

  function handleclick() {
    setEditTerm((prev) => (prev === "True" ? "False" : "True"));
  }

  // Handler to open modal
  function handleDeleteModal() {
    setDeleteModalOpen(true);
  }

  // Handle selection changes: "reassignStaffId" or "delete"
  function handleAssignmentChange(clientId: string, value: string) {
    setClientAssignments((prev) => ({ ...prev, [clientId]: value }));
  }

  // Final submission (calls your server API that invokes the procedure)
  async function handleConfirmDelete() {
    if (Object.keys(clientAssignments).length === 0) {
      alert("Please select an action for at least one client");
      return;
    }

    // Show loading state
    setLoading(true);

    // Build array of fetch Promises
    const requests = Object.entries(clientAssignments).map(
      async ([clientId, actionValue]) => {
        // Construct payload for the API
        const payload = {
          staffId: staff?.staff_id,
          action: actionValue === "delete" ? "past client" : "reassign",
          newStaffId: actionValue === "delete" ? null : actionValue,
          clientId,
        };

        console.log(
          `Processing client ${clientId} with action:`,
          payload.action
        );

        try {
          const response = await fetch("/api/admin/staff/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || "API error");
          }

          return { clientId, success: true, message: result.message };
        } catch (error) {
          console.error(`Error for client ${clientId}:`, error);
          return {
            clientId,
            success: false,
            message: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }
    );

    try {
      // Wait for all requests to complete
      const results = await Promise.all(requests);

      // Count successes and failures
      const successes = results.filter((r) => r.success).length;
      const failures = results.filter((r) => !r.success).length;

      if (failures === 0) {
        alert(`Successfully processed ${successes} client(s)`);

        // Refresh data after successful operations
        window.location.reload();
      } else {
        alert(
          `Completed: ${successes} success, ${failures} failed. See console for details.`
        );
      }
    } catch (error) {
      console.error("Error during client processing:", error);
      alert("An error occurred. Please check the console for details.");
    } finally {
      setDeleteModalOpen(false);
      setLoading(false);
    }
  }

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

  if (!staff) {
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
                  {staff.image ? (
                    <Image
                      src={staff.image}
                      alt={`Photo of ${staff.name}`}
                      className="h-full w-full object-cover object-top"
                      width={144} // Add width property (36*4)
                      height={144} // Add height property (36*4)
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-2xl">
                        {staff.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:ml-8 text-center md:text-left mt-4">
                <h1 className="text-3xl font-bold text-white mt-4">
                  {staff.name}
                </h1>
                <p className="text-lg text-gray-600">
                  {staff.designation || staff.s_role}
                </p>

                <div className="mt-4">
                  <Button
                    onClick={handleclick}
                    className="bg-gray-800 hover:bg-black text-white px-6 py-2 rounded-lg transition-colors duration-200"
                  >
                    Edit Profile
                  </Button>
                </div>
                <div className="mt-4">
                  {/* Add button to open Delete/Reassign modal */}
                  <Button
                    onClick={handleDeleteModal}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                  >
                    Delete/Reassign Staff
                  </Button>
                </div>
              </div>
            </div>

            {/* Details section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <DetailItem
                label="Experience"
                value={`${staff.experience} Years`}
                icon="📊"
              />
              <DetailItem label="Role" value={staff.s_role} icon="🏛️" />
              <DetailItem
                label="Email"
                value={staff.staff_auth?.email || "N/A"}
                icon="📧"
              />
              <DetailItem label="Phone" value={staff.phone_no} icon="📱" />
              <DetailItem label="Address" value={staff.address} icon="📍" />
              <DetailItem
                label="Bar Number"
                value={staff.bar_number || "N/A"}
                icon="⚖️"
              />
              <DetailItem
                label="Specialization"
                value={staff.specialisation || "N/A"}
                icon="🔍"
              />
              <DetailItem
                label="Designation"
                value={staff.designation || "N/A"}
                icon="🏷️"
              />
            </div>
            {/* Clients Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Associated Clients
              </h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {staff.clients && staff.clients.length > 0 ? (
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
                        {staff.clients.map((client) => (
                          <tr
                            key={client.client_id}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                              {client.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {client.phone_no}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {client.address || "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No clients associated with this staff member
                  </p>
                )}
              </div>
            </div>

            {/* Cases Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                All Cases
              </h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {staff.cases && staff.cases.length > 0 ? (
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
                        {staff.cases.map((case_) => (
                          <tr key={case_.case_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {case_.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${
                                  case_.status === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : case_.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : case_.status === "Closed"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {case_.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {case_.next_hearing_date
                                ? new Date(
                                    case_.next_hearing_date
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

            {/* Appointments Section */}
            <div className="mt-12 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                All Appointments
              </h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {staff.appointments && staff.appointments.length > 0 ? (
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
                        {staff.appointments.map((appointment) => (
                          <tr
                            key={appointment.appointment_id}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {appointment.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {appointment.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {appointment.time}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {appointment.location}
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
          </div>
        </div>
      </div>

      {/* Modal overlay */}
      {editTerm === "True" && (
        <>
          {/* Dark transparent overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setEditTerm("False")}
          ></div>

          {/* Centered modal container */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gray-900 px-6 py-4 rounded-t-2xl flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">
                  Edit Staff Profile
                </h2>
                <button
                  onClick={() => setEditTerm("False")}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <Staffedit
                staffId={staff.staff_id}
                initialData={{
                  name: staff.name,
                  experience: staff.experience,
                  phone_no: staff.phone_no,
                  bar_number: staff.bar_number,
                  address: staff.address,
                  specialisation: staff.specialisation,
                  s_role: staff.s_role,
                  designation: staff.designation,
                  image: staff.image,
                }}
                onClose={() => setEditTerm("False")}
                onSuccess={() => {
                  setEditTerm("False");
                  // Refresh data after successful edit
                  setLoading(true);
                  fetch(`/api/admin/staff/${id}`)
                    .then((res) => res.json())
                    .then((data: Staff) => {
                      setStaff(data);
                    })
                    .finally(() => setLoading(false));
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* Delete/Reassign Modal */}
      {deleteModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-75 z-40"
            onClick={() => setDeleteModalOpen(false)}
          ></div>

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-6 max-w-xl w-full max-h-[80vh] overflow-y-auto"
            >
              <h2 className="text-lg font-bold mb-4">
                Reassign or Delete Clients
              </h2>
              {staff.clients && staff.clients.length > 0 ? (
                staff.clients.map((client) => {
                  // Get only cases that this staff handles for this client
                  const clientCases =
                    getClientCasesMap()[client.client_id] || [];

                  return (
                    <div key={client.client_id} className="mb-6 pb-4 border-b">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-lg">
                          {client.name}
                        </span>
                        <select
                          className="border rounded px-2 py-1"
                          onChange={(e) =>
                            handleAssignmentChange(
                              client.client_id,
                              e.target.value
                            )
                          }
                          defaultValue=""
                        >
                          <option value="">Select an option</option>
                          <option value="delete">Mark as Past Client</option>
                          {allStaff
                            .filter((s) => s.staff_id !== staff.staff_id)
                            .map((s) => (
                              <option key={s.staff_id} value={s.staff_id}>
                                {s.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Show only cases this staff handles for this client */}
                      <div className="ml-3 text-sm">
                        <p className="text-gray-700 font-medium">
                          Cases to be reassigned:
                        </p>
                        {clientCases.length > 0 ? (
                          <ul className="list-disc ml-5 text-gray-600">
                            {clientCases.map((c) => (
                              <li key={c.case_id}>{c.title}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 ml-5">No active cases</p>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">No clients found.</p>
              )}
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  onClick={() => setDeleteModalOpen(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
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
