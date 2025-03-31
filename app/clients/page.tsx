import React from "react";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const clients = async () => {
  const clients = await prisma.client.findMany();
  return (
    <div>
      <div>
        <table>
          <thead>
            <tr>
              <th> Client Name</th>
              {/* Add other headers if needed */}
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.client_id}>
                <td>{client.client_id}</td>
                <td>{client.name}</td>
                {/* Render other client fields as needed */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default clients;
