import { prisma } from "@/prisma/client";
import React from "react";

export default async function Home() {
  const clients = await prisma.staff.findMany({
    include: {
      staff_auth: true, // Include related User data
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
            <th>Bar Number</th>
            <th>Designation</th>
            <th>Specialisation</th>
            <th>Experience</th>
            <th>Role</th>
            {/* Add other headers if needed */}
          </tr>
        </thead>
        <tbody>
          {clients.map((staff) => (
            <tr key={staff.staff_id}>
              <td>{staff.name}</td>
              <td>{staff.address}</td>
              <td>{staff.phone_no}</td>
              <td>{staff.staff_auth.email}</td>
              <td>{staff.bar_number}</td>
              <td>{staff.designation}</td>
              <td>{staff.specialisation}</td>
              <td>{staff.experience}</td>
              <td>{staff.s_role}</td>
              {/* Render other client fields as needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
