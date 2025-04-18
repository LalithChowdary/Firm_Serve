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
    <div className="bg-white min-h-screen p-8 grid grid-cols-2 grid-rows-1">
      {/* Left side: Documents list */}
      <div className="pr-4 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 pl-2">
          Your Documents
        </h1>

        <div className="pl-12">
          {loading ? (
            <p>Loading documents...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : filteredDocuments.length === 0 ? (
            <>
              <p>No documents match your filters.</p>
              <p className="text-sm text-gray-500 mt-2">
                Try clearing filters or contact your administrator.
              </p>
            </>
          ) : (
            filteredDocuments.map((doc) => (
              <div
                key={doc.doc_id}
                className="grid grid-cols-1 grid-rows-2 mb-8"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
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
                  <hr className="w-[70%]" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right side: Fixed search component */}
      <div className="relative">
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
