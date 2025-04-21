import React, { useState, useEffect } from "react";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
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

interface FormFields {
  title: string;
  court_name: string;
  case_type: string;
  status: string;
  filing_date: string;
  selectedClients: string[];
  selectedStaff: string[];
}

const CaseAdd: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState<FormFields>({
    title: "",
    court_name: "",
    case_type: "civil",
    status: "open",
    filing_date: new Date().toISOString().split("T")[0], // Today's date
    selectedClients: [],
    selectedStaff: [],
  });

  const [availableClients, setAvailableClients] = useState<Client[]>([]);
  const [availableStaff, setAvailableStaff] = useState<Staff[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Fetch clients and staff
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        // Fetch clients
        const clientsRes = await fetch("/api/admin/client");
        const clientsData = await clientsRes.json();
        setAvailableClients(clientsData);

        // Fetch staff
        const staffRes = await fetch("/api/admin/staff");
        const staffData = await staffRes.json();
        setAvailableStaff(staffData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load clients and staff data");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleClientToggle(clientId: string) {
    setForm((prev) => {
      const selected = [...prev.selectedClients];
      const index = selected.indexOf(clientId);

      if (index === -1) {
        selected.push(clientId);
      } else {
        selected.splice(index, 1);
      }

      return {
        ...prev,
        selectedClients: selected,
      };
    });
  }

  function handleStaffToggle(staffId: string) {
    setForm((prev) => {
      const selected = [...prev.selectedStaff];
      const index = selected.indexOf(staffId);

      if (index === -1) {
        selected.push(staffId);
      } else {
        selected.splice(index, 1);
      }

      return {
        ...prev,
        selectedStaff: selected,
      };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.selectedClients.length === 0) {
      setError("Please select at least one client");
      return;
    }

    if (form.selectedStaff.length === 0) {
      setError("Please select at least one staff member");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/admin/case/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          court_name: form.court_name,
          case_type: form.case_type,
          status: form.status,
          filing_date: form.filing_date,
          clients: form.selectedClients,
          staff: form.selectedStaff,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create case");
      }

      onSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full overflow-auto max-h-[90vh]">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
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

      <h2 className="text-2xl font-semibold text-gray-900 text-center pt-6 pb-2">
        Add New Case
      </h2>

      {error && (
        <div className="mx-6 mt-2 p-3 bg-red-50 text-red-600 rounded">
          {error}
        </div>
      )}

      {loadingData ? (
        <div className="p-6 text-center">
          <svg
            className="animate-spin h-8 w-8 mx-auto text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-2 text-gray-600">Loading client and staff data...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Case Details Section */}
            <div className="md:col-span-2 border-b pb-4 mb-4">
              <h3 className="font-medium text-lg mb-4">Case Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Court Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="court_name"
                    value={form.court_name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Filing Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="filing_date"
                    value={form.filing_date}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Case Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="case_type"
                    value={form.case_type}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="civil">Civil</option>
                    <option value="criminal">Criminal</option>
                    <option value="corporate">Corporate</option>
                    <option value="family">Family</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Clients Section */}
            <div className="border rounded-lg p-4 max-h-[300px] overflow-y-auto">
              <h3 className="font-medium text-gray-800 mb-3">
                Select Clients <span className="text-red-500">*</span>
              </h3>

              {availableClients.length === 0 ? (
                <p className="text-gray-500 text-sm">No clients available</p>
              ) : (
                <ul className="space-y-2">
                  {availableClients.map((client) => (
                    <li key={client.client_id} className="flex items-center">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.selectedClients.includes(
                            client.client_id
                          )}
                          onChange={() => handleClientToggle(client.client_id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <span className="ml-2 text-gray-700">
                          {client.name}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Staff Section */}
            <div className="border rounded-lg p-4 max-h-[300px] overflow-y-auto">
              <h3 className="font-medium text-gray-800 mb-3">
                Select Staff <span className="text-red-500">*</span>
              </h3>

              {availableStaff.length === 0 ? (
                <p className="text-gray-500 text-sm">No staff available</p>
              ) : (
                <ul className="space-y-2">
                  {availableStaff.map((staff) => (
                    <li key={staff.staff_id} className="flex items-center">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.selectedStaff.includes(staff.staff_id)}
                          onChange={() => handleStaffToggle(staff.staff_id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <span className="ml-2 text-gray-700">
                          {staff.name} {staff.s_role ? `(${staff.s_role})` : ""}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-6 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {submitting ? "Creating..." : "Create Case"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CaseAdd;
