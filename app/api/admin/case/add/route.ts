import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { z } from "zod";
import { v4 as uuidv4 } from 'uuid'; // Add this import

const caseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  court_name: z.string().min(1, "Court name is required"),
  case_type: z.string().min(1, "Case type is required"),
  status: z.string().min(1, "Status is required"),
  filing_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  clients: z.array(z.string()).min(1, "At least one client is required"),
  staff: z.array(z.string()).min(1, "At least one staff member is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validationResult = caseSchema.safeParse(body);

    if (!validationResult.success) {
      const formattedErrors = validationResult.error.format();
      return NextResponse.json(
        { error: "Validation error", details: formattedErrors },
        { status: 400 }
      );
    }

    const { title, court_name, case_type, status, filing_date, clients, staff } = validationResult.data;
    
    // Generate a unique ID for the case
    const caseId = uuidv4();

    // Create case with transaction to ensure all relations are created
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the case
      const newCase = await tx.cases.create({
        data: {
          case_id: caseId, // Add this line to provide the required case_id
          title,
          court_name,
          case_type,
          status,
          filing_date: new Date(filing_date),
        },
      });

      // 2. Create client relationships
      const clientPromises = clients.map((clientId) =>
        tx.client_Case.create({
          data: {
            client_id: clientId,
            case_id: newCase.case_id,
          },
        })
      );
      
      // 3. Create staff relationships
      const staffPromises = staff.map((staffId) =>
        tx.staff_Case.create({
          data: {
            staff_id: staffId,
            case_id: newCase.case_id,
          },
        })
      );

      // Execute all promises
      await Promise.all([...clientPromises, ...staffPromises]);

      return newCase;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("Error creating case:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create case" },
      { status: 500 }
    );
  }
}