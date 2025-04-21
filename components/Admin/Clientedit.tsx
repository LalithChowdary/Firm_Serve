"use client";

import React, { useState } from "react";

interface ClienteditProps {
  clientId: string;
  initialData?: {
    name?: string;
    phone_no?: string;
    address?: string;
    image?: string;
  };
  onClose?: () => void;
  onSuccess?: () => void;
}

const Clientedit: React.FC<ClienteditProps> = ({
  clientId,
  initialData = {},
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({ ...initialData });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      console.log("Submitting data:", formData);
      console.log("To endpoint:", `/api/admin/client/${clientId}`);

      const res = await fetch(`/api/admin/client/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Updated successfully:", data);
        alert("Client updated successfully!");
        if (onSuccess) {
          onSuccess();
        }
      } else {
        console.error("Update failed:", data);
        setError(data.error || "Failed to update client information");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setError("An error occurred while updating");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-gray-50 rounded-md shadow-sm space-y-4 max-w-full md:max-w-2xl mx-auto"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Edit Client</h2>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {/* Form layout - grid on desktop, stack on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            name="phone_no"
            value={formData.phone_no || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-gray-700 mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-gray-700 mb-1">Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 pt-3 border-t border-gray-200">
        <button
          type="submit"
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>

        {onClose && (
          <button
            type="button"
            className="w-full sm:w-auto bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none transition-colors"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default Clientedit;
