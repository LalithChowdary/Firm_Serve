import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { v4 as uuidv4 } from 'uuid';
import { z } from "zod";

const appointmentSchema = z.object({
  purpose: z.string().min(1, "Purpose is required"),
  location: z.string().min(1, "Location is required"),
  appointment_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Valid date is required",
  }),
  case_id: z.string().nullable().optional(),
  clients: z.array(z.string()).optional().default([]),
  staff: z.array(z.string()).optional().default([])
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validationResult = appointmentSchema.safeParse(body);

    if (!validationResult.success) {
      const formattedErrors = validationResult.error.format();
      return NextResponse.json(
        { error: "Validation error", details: formattedErrors },
        { status: 400 }
      );
    }

    const { purpose, location, appointment_date, case_id, clients, staff } = validationResult.data;
    
    // Generate unique ID for the appointment
    const appointmentId = uuidv4();

    // Create appointment with transaction to ensure all relations are created
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the appointment
      // Create a data object that respects the schema requirements
      const appointmentData: any = {
        appointment_id: appointmentId,
        purpose,
        location,
        appointment_date: new Date(appointment_date),
        status: 'scheduled'
      };
      
      // Only include case_id if it has a value
      if (case_id) {
        appointmentData.case_id = case_id;
      }
      
      const newAppointment = await tx.appointment.create({
        data: appointmentData
      });

      // 2. Create client relationships (if any)
      if (clients.length > 0) {
        const clientPromises = clients.map((clientId) =>
          tx.appointment_Client.create({
            data: {
              appointment_id: newAppointment.appointment_id,
              client_id: clientId,
            },
          })
        );
        await Promise.all(clientPromises);
      }
      
      // 3. Create staff relationships (if any)
      if (staff.length > 0) {
        const staffPromises = staff.map((staffId) =>
          tx.appointment_Staff.create({
            data: {
              appointment_id: newAppointment.appointment_id,
              staff_id: staffId,
            },
          })
        );
        await Promise.all(staffPromises);
      }

      return newAppointment;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create appointment" },
      { status: 500 }
    );
  }
}