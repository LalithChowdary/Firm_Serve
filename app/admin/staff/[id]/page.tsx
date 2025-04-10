"use client";

import React, { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import Staffedit from "@/components/Admin/Staffedit";
import Image from "next/image";

// Staff interface based on the Prisma schema
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
}

export default function Staffinfo({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Fix: Remove the use hook and directly use params.id
  const { id } = use(params);
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editTerm, setEditTerm] = useState("False");

  useEffect(() => {
    console.log("Fetching staff with ID:", id);
    fetch(`/api/admin/staff/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        return res.json();
      })
      .then((data: Staff) => {
        console.log("API response:", data);
        setStaff(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  function handleclick() {
    setEditTerm((prev) => (prev === "True" ? "False" : "True"));
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
