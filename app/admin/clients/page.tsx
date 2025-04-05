import { prisma } from "@/prisma/client";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
  const clients = await prisma.client.findMany({
    include: {
      client_auth: true, // Include related User data
    },
  });

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Phone No</th>
            <th>Email</th>
            {/* Add other headers if needed */}
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.client_id}>
              <td>{client.name}</td>
              <td>{client.address}</td>
              <td>{client.phone_no}</td>
              <td>{client.client_auth.email}</td>
              <td></td>
              {/* Render other client fields as needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
