import { prisma } from "@/prisma/client";
import React from "react";

export default async function Home() {
  const cases = await prisma.cases.findMany({
    include: {
      Client_Case: {
        include: {
          Client: {
            include: {
              client_auth: true,
            },
          },
        },
      },
      Staff_Case: {
        include: {
          Staff: true,
        },
      },
    },
  });

  return (
    <div>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th>Case Title</th>
            <th>Case Type</th>
            <th>Filing Date</th>
            <th>Status</th>
            <th>Client Name</th>
            <th>Client Email</th>
            <th>Client Phone</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((caseItem) =>
            // If a case has multiple clients, this will show one row per client
            caseItem.Client_Case.map((clientCase) => (
              <tr
                key={`${caseItem.case_id}-${clientCase.client_id}`}
                className="border-b"
              >
                <td className="border p-2">{caseItem.title}</td>
                <td className="border p-2">{caseItem.case_type}</td>
                <td className="border p-2">
                  {new Date(caseItem.filing_date).toLocaleDateString()}
                </td>
                <td className="border p-2">{caseItem.status}</td>
                <td className="border p-2">{clientCase.Client.name}</td>
                <td className="border p-2">
                  {clientCase.Client.client_auth.email}
                </td>
                <td className="border p-2">{clientCase.Client.phone_no}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
