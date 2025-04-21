"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [caseData, setCaseData] = useState<CaseTable | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // New state variables for edit functionality
  const [editStatus, setEditStatus] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch case data
  const fetchCaseData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/case/${id}`);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data: CaseTable = await response.json();
      setCaseData(data);
      if (data.status) setNewStatus(data.status);
    } catch (error) {
      console.log(error);
      setCaseData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseData();
  }, [id]);

  // Update case status
  const updateCaseStatus = async () => {
    if (!caseData || !newStatus) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/case/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update case status");
      }

      const updatedCase = await response.json();
      setCaseData({ ...caseData, status: newStatus });
      setEditStatus(false);
      alert("Case status updated successfully");
    } catch (error) {
      console.error("Error updating case:", error);
      alert("Failed to update case status");
    } finally {
      setSaving(false);
    }
  };

  // Add client to case
  const addClientToCase = async (clientId: string) => {
    try {
      const response = await fetch(`/api/admin/case/${id}/client`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add client");
      }

      // Refresh case data
      fetchCaseData();
      setShowClientModal(false);
    } catch (error) {
      console.error("Error adding client:", error);
      alert("Failed to add client to case");
    }
  };

  // Remove client from case
  const removeClientFromCase = async (clientId: string) => {
    if (!confirm("Are you sure you want to remove this client from the case?"))
      return;

    try {
      const response = await fetch(`/api/admin/case/${id}/client/${clientId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove client");
      }

      // Refresh case data
      fetchCaseData();
    } catch (error) {
      console.error("Error removing client:", error);
      alert("Failed to remove client from case");
    }
  };

  // Add staff to case
  const addStaffToCase = async (staffId: string) => {
    try {
      const response = await fetch(`/api/admin/case/${id}/staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add staff");
      }

      // Refresh case data
      fetchCaseData();
      setShowStaffModal(false);
    } catch (error) {
      console.error("Error adding staff:", error);
      alert("Failed to add staff to case");
    }
  };

  // Remove staff from case
  const removeStaffFromCase = async (staffId: string) => {
    if (!confirm("Are you sure you want to remove this staff from the case?"))
      return;

    try {
      const response = await fetch(`/api/admin/case/${id}/staff/${staffId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove staff");
      }

      // Refresh case data
      fetchCaseData();
    } catch (error) {
      console.error("Error removing staff:", error);
      alert("Failed to remove staff from case");
    }
  };

  // Delete entire case
  const deleteCase = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this case? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/admin/case/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete case");
      }

      alert("Case deleted successfully");
      router.push("/admin/cases");
    } catch (error) {
      console.error("Error deleting case:", error);
      alert("Failed to delete case");
    } finally {
      setDeleteLoading(false);
    }
  };

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
            {/* Case Title and Actions */}
            <div className="flex flex-col md:flex-row mb-8">
              <div className="flex-shrink-0 mb-4 md:mb-0">
                <div className="h-36 w-36 mx-auto md:mx-0 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-4xl">⚖️</span>
                </div>
              </div>
              <div className="md:ml-8 text-center md:text-left mt-4 flex-grow">
                <h1 className="text-3xl font-bold text-white mt-4">
                  {caseData.title}
                </h1>

                {/* Action Buttons */}
                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                  <button
                    onClick={() => setEditStatus(!editStatus)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    {editStatus ? "Cancel" : "Edit Status"}
                  </button>
                  <button
                    onClick={deleteCase}
                    disabled={deleteLoading}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    {deleteLoading ? "Deleting..." : "Delete Case"}
                  </button>
                </div>
              </div>
            </div>

            {/* Status Edit Form */}
            {editStatus && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium mb-3">Update Case Status</h3>
                <div className="flex flex-wrap gap-3">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Closed">Closed</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                  <button
                    onClick={updateCaseStatus}
                    disabled={saving || !newStatus}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            )}

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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Associated Clients
                </h2>
                <button
                  onClick={() => setShowClientModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                >
                  + Add Client
                </button>
              </div>
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                onClick={() =>
                                  removeClientFromCase(client.client_id)
                                }
                                className="text-red-600 hover:text-red-900"
                              >
                                Remove
                              </button>
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Associated Staff
                </h2>
                <button
                  onClick={() => setShowStaffModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                >
                  + Add Staff
                </button>
              </div>
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
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
                                  <span className=" w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mr-2">
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                onClick={() =>
                                  removeStaffFromCase(staff.staff_id)
                                }
                                className="text-red-600 hover:text-red-900"
                              >
                                Remove
                              </button>
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

      {/* Client Selection Modal */}
      {showClientModal && (
        <ClientSelectionModal
          onClose={() => setShowClientModal(false)}
          onSelect={addClientToCase}
          currentClientIds={clients.map((c) => c.client_id)}
        />
      )}

      {/* Staff Selection Modal */}
      {showStaffModal && (
        <StaffSelectionModal
          onClose={() => setShowStaffModal(false)}
          onSelect={addStaffToCase}
          currentStaffIds={staffList.map((s) => s.staff_id)}
        />
      )}
    </div>
  );
}

// Client Selection Modal Component
function ClientSelectionModal({
  onClose,
  onSelect,
  currentClientIds,
}: {
  onClose: () => void;
  onSelect: (id: string) => void;
  currentClientIds: string[];
}) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch("/api/admin/client");
        const data = await res.json();
        // Filter out clients that are already associated with the case
        const availableClients = data.filter(
          (client: Client) => !currentClientIds.includes(client.client_id)
        );
        setClients(availableClients);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, [currentClientIds]);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.phone_no.includes(search)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">Select Client</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
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

        <div className="p-4">
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />

          <div className="overflow-y-auto max-h-[50vh]">
            {loading ? (
              <p className="text-center py-4">Loading clients...</p>
            ) : filteredClients.length === 0 ? (
              <p className="text-center py-4">No clients available</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <li key={client.client_id} className="py-3">
                    <button
                      onClick={() => onSelect(client.client_id)}
                      className="w-full text-left hover:bg-gray-50 p-2 rounded flex items-center"
                    >
                      <div className="flex-shrink-0">
                        {client.image ? (
                          <Image
                            src={client.image}
                            alt={client.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <span className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
                            {client.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-gray-500">
                          {client.phone_no}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Staff Selection Modal Component
function StaffSelectionModal({
  onClose,
  onSelect,
  currentStaffIds,
}: {
  onClose: () => void;
  onSelect: (id: string) => void;
  currentStaffIds: string[];
}) {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchStaff() {
      try {
        const res = await fetch("/api/admin/staff");
        const data = await res.json();
        // Filter out staff that are already associated with the case
        const availableStaff = data.filter(
          (staff: Staff) => !currentStaffIds.includes(staff.staff_id)
        );
        setStaffList(availableStaff);
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStaff();
  }, [currentStaffIds]);

  const filteredStaff = staffList.filter(
    (staff) =>
      staff.name.toLowerCase().includes(search.toLowerCase()) ||
      staff.phone_no.includes(search)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">Select Staff</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
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

        <div className="p-4">
          <input
            type="text"
            placeholder="Search staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />

          <div className="overflow-y-auto max-h-[50vh]">
            {loading ? (
              <p className="text-center py-4">Loading staff...</p>
            ) : filteredStaff.length === 0 ? (
              <p className="text-center py-4">No staff available</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredStaff.map((staff) => (
                  <li key={staff.staff_id} className="py-3">
                    <button
                      onClick={() => onSelect(staff.staff_id)}
                      className="w-full text-left hover:bg-gray-50 p-2 rounded flex items-center"
                    >
                      <div className="flex-shrink-0">
                        {staff.image ? (
                          <Image
                            src={staff.image}
                            alt={staff.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <span className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
                            {staff.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">{staff.name}</p>
                        <p className="text-sm text-gray-500">
                          {staff.s_role || "Staff"}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
