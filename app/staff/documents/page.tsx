"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface StaffDocument {
  doc_id: string;
  upload_date: string;
  doc_type: string;
  Cases?: {
    title?: string;
  };
}

export default function StaffDocuments() {
  const { status } = useSession();
  const [documentList, setDocumentList] = useState<StaffDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    setLoading(true);
    fetch("/api/staff/documents")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API returned ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data: StaffDocument[]) => {
        console.log("Fetched documents:", data);
        setDocumentList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching documents:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [status]);

  const filteredDocuments = documentList.filter((doc) => {
    const matchesSearch =
      searchTerm === "" ||
      doc.doc_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.Cases?.title &&
        doc.Cases.title.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  // Format a date from an ISO string
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString();
  };

  if (status === "loading") {
    return <p className="p-8">Loading session...</p>;
  }

  if (status === "unauthenticated") {
    return <p className="p-8">You must be signed in to view your documents.</p>;
  }

  return (
    <div className="bg-white min-h-screen p-4 md:p-8 flex flex-col md:grid md:grid-cols-2 md:grid-rows-1 gap-6">
      {/* Mobile search - visible only on small screens */}
      <div className="md:hidden mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Your Documents
        </h1>
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Find Document
          </h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Documents"
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
        </div>
      </div>

      {/* Left side: Documents list */}
      <div className="md:pr-4 overflow-y-auto order-2 md:order-1">
        <h1 className="hidden md:block text-3xl font-bold text-gray-800 mb-6 pl-2">
          Your Documents
        </h1>

        <div className="md:pl-12">
          {loading ? (
            <p className="text-center py-4">Loading documents...</p>
          ) : error ? (
            <p className="text-red-500 text-center py-4">Error: {error}</p>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-4">
              <p>No documents match your filters.</p>
              <p className="text-sm text-gray-500 mt-2">
                Try clearing filters or contact your administrator.
              </p>
            </div>
          ) : (
            filteredDocuments.map((doc) => (
              <div
                key={doc.doc_id}
                className="grid grid-cols-1 grid-rows-2 mb-6 md:mb-8 p-3 rounded-lg hover:bg-gray-50"
              >
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                    {doc.doc_type}
                  </h2>
                </div>
                <div className="flex flex-col ml-2 mt-[-6px]">
                  <div className="font-medium text-gray-700">
                    Case: {doc.Cases?.title || "Unknown case"}
                  </div>
                  <div className="font-medium text-gray-700">
                    Uploaded: {formatDate(doc.upload_date)}
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
      <div className="hidden md:block relative order-1 md:order-2">
        <div className="sticky top-[30%] left-0 flex justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Find Document
            </h3>
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Documents"
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
          </div>
        </div>
      </div>
    </div>
  );
}
