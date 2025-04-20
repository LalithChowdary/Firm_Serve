import React, { useState } from "react";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

interface FormFields {
  name: string;
  experience: number;
  phone_no: string;
  bar_number: string;
  address: string;
  specialisation: string;
  s_role: string;
  designation: string;
  image: string;
  email: string;
  password: string;
}

const StaffAdd: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState<FormFields>({
    name: "",
    experience: 0,
    phone_no: "",
    bar_number: "",
    address: "",
    specialisation: "",
    s_role: "",
    designation: "",
    image: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "experience" ? parseInt(value || "0", 10) : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Add failed");
      onSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  const fields = [
    { label: "Name", name: "name", type: "text", span: 2 },
    { label: "Experience", name: "experience", type: "number" },
    { label: "Phone No.", name: "phone_no", type: "text" },
    { label: "Bar Number", name: "bar_number", type: "text" },
    { label: "Address", name: "address", type: "text", span: 2 },
    { label: "Specialisation", name: "specialisation", type: "text" },
    { label: "Role", name: "s_role", type: "text" },
    { label: "Designation", name: "designation", type: "text" },
    { label: "Image URL", name: "image", type: "text" },
    { label: "Email", name: "email", type: "email", span: 2 },
    { label: "Password", name: "password", type: "password", span: 2 },
  ];

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full overflow-auto max-h-[90vh]">
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
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 text-center pt-6">
        Add New Staff
      </h2>
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 text-red-600 rounded">
          {error}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6"
      >
        {fields.map(({ label, name, type, span }) => (
          <div key={name} className={span === 2 ? "md:col-span-2" : ""}>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              {label}
            </label>
            <input
              type={type}
              name={name}
              value={form[name as keyof FormFields]}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        ))}

        <div className="md:col-span-2 flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffAdd;
