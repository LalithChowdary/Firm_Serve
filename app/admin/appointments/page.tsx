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

interface Client {
  client_id: string;
  name: string;
}

interface Staff {
  staff_id: string;
  name: string;
  s_role?: string;
}

interface Case {
  case_id: string;
  title: string;
  status?: string; // Add the status property
}

export default function Home() {
  const [appointmentList, setAppointmentList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Function to fetch appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/appointments");
      const data = await res.json();
      console.log("Fetched appointment data:", data);
      setAppointmentList(data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
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
          <div className="relative mb-4">
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

          {/* Add Appointment button for mobile */}
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            + Add New Appointment
          </button>
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

              {/* Add Appointment button for desktop */}
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-6 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
              >
                + Add New Appointment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for adding a new appointment */}
      {showAddModal && (
        <AppointmentAddModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            fetchAppointments();
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

// AppointmentAddModal Component
interface AppointmentAddModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AppointmentAddModal: React.FC<AppointmentAddModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const [form, setForm] = useState({
    purpose: "",
    location: "",
    appointment_date: "",
    appointment_time: "",
    case_id: "",
    selectedClients: [] as string[],
    selectedStaff: [] as string[],
  });

  const [clients, setClients] = useState<Client[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch clients, staff, and cases
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch clients
        const clientsRes = await fetch("/api/admin/client");
        const clientsData = await clientsRes.json();
        setClients(clientsData);

        // Fetch staff
        const staffRes = await fetch("/api/admin/staff");
        const staffData = await staffRes.json();
        setStaff(staffData);

        // Fetch cases
        const casesRes = await fetch("/api/admin/case");
        const casesData = await casesRes.json();

        // Filter out inactive cases
        const activeCases = casesData.filter(
          (c: Case) => c.status !== "INACTIVE"
        );
        setCases(activeCases);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Skip case_id as it's handled separately by handleCaseChange
    if (name === "case_id") return;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCaseChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const caseId = e.target.value;

    // Update case_id in the form
    setForm((prev) => ({ ...prev, case_id: caseId }));

    // If no case is selected, just clear the selections
    if (!caseId) {
      setForm((prev) => ({
        ...prev,
        selectedClients: [],
        selectedStaff: [],
      }));
      return;
    }

    try {
      // Fetch case details with related clients and staff
      const res = await fetch(`/api/admin/case/${caseId}`);

      if (!res.ok) {
        throw new Error("Failed to fetch case details");
      }

      const caseData = await res.json();

      // Extract client IDs from case data
      const caseClients =
        caseData.Client_Case?.map(
          (clientCase: { client_id: string }) => clientCase.client_id
        ) || [];

      // Extract staff IDs from case data
      const caseStaff =
        caseData.Staff_Case?.map(
          (staffCase: { staff_id: string }) => staffCase.staff_id
        ) || [];

      // Update form with selected clients and staff
      setForm((prev) => ({
        ...prev,
        selectedClients: caseClients,
        selectedStaff: caseStaff,
      }));
    } catch (err) {
      console.error("Error fetching case details:", err);
      setError("Failed to load case details");
    }
  };

  const toggleClient = (clientId: string) => {
    setForm((prev) => {
      const selected = [...prev.selectedClients];
      const index = selected.indexOf(clientId);

      if (index === -1) {
        selected.push(clientId);
      } else {
        selected.splice(index, 1);
      }

      return { ...prev, selectedClients: selected };
    });
  };

  const toggleStaff = (staffId: string) => {
    setForm((prev) => {
      const selected = [...prev.selectedStaff];
      const index = selected.indexOf(staffId);

      if (index === -1) {
        selected.push(staffId);
      } else {
        selected.splice(index, 1);
      }

      return { ...prev, selectedStaff: selected };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    if (
      !form.purpose ||
      !form.location ||
      !form.appointment_date ||
      !form.appointment_time
    ) {
      setError("Purpose, location, date and time are required");
      setSubmitting(false);
      return;
    }

    try {
      // Combine date and time
      const dateTime = new Date(
        `${form.appointment_date}T${form.appointment_time}`
      );

      const res = await fetch("/api/admin/appointments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purpose: form.purpose,
          location: form.location,
          appointment_date: dateTime.toISOString(),
          case_id: form.case_id || null,
          clients: form.selectedClients,
          staff: form.selectedStaff,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create appointment");
      }

      onSuccess();
    } catch (err) {
      console.error("Error creating appointment:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create appointment"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-semibold">Add New Appointment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mx-4 mt-2 p-3 bg-red-50 text-red-600 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Appointment Details */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purpose <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="purpose"
                    value={form.purpose}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="appointment_date"
                      value={form.appointment_date}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      name="appointment_time"
                      value={form.appointment_time}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Associated Case (Optional)
                  </label>
                  <select
                    name="case_id"
                    value={form.case_id}
                    onChange={handleCaseChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">None</option>
                    {cases.map((c: Case) => (
                      <option key={c.case_id} value={c.case_id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Client Section */}
              <div className="border rounded-md p-3 max-h-[250px] overflow-y-auto">
                <h3 className="font-medium mb-2">Clients (Optional)</h3>
                {clients.length === 0 ? (
                  <p className="text-gray-500 text-sm">No clients available</p>
                ) : (
                  <div className="space-y-2">
                    {clients.map((client) => (
                      <div key={client.client_id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`client-${client.client_id}`}
                          checked={form.selectedClients.includes(
                            client.client_id
                          )}
                          onChange={() => toggleClient(client.client_id)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`client-${client.client_id}`}
                          className="ml-2 text-sm text-gray-700 cursor-pointer"
                        >
                          {client.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Staff Section */}
              <div className="border rounded-md p-3 max-h-[250px] overflow-y-auto">
                <h3 className="font-medium mb-2">Staff (Optional)</h3>
                {staff.length === 0 ? (
                  <p className="text-gray-500 text-sm">No staff available</p>
                ) : (
                  <div className="space-y-2">
                    {staff.map((s) => (
                      <div key={s.staff_id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`staff-${s.staff_id}`}
                          checked={form.selectedStaff.includes(s.staff_id)}
                          onChange={() => toggleStaff(s.staff_id)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`staff-${s.staff_id}`}
                          className="ml-2 text-sm text-gray-700 cursor-pointer"
                        >
                          {s.name} {s.s_role ? `(${s.s_role})` : ""}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {submitting ? "Creating..." : "Create Appointment"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
