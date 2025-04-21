import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function POST(req: Request) {
  try {
    // Log received request
    console.log("Received delete request");
    
    // Parse request body with error handling
    let clientId;
    try {
      const body = await req.json();
      clientId = body.clientId;
      console.log("Client ID to delete:", clientId);
    } catch (parseError) {
      console.error("Error parsing request:", parseError);
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    if (!clientId) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 }
      );
    }

    // Use executeRawUnsafe with parameter placeholders instead of template literals
    try {
      console.log(`Attempting to call sp_archive_client with ID: ${clientId}`);
      
      // Call the stored procedure with proper parameter binding
      await prisma.$executeRawUnsafe(
        "CALL sp_archive_client(?)",
        clientId
      );
      
      console.log("Stored procedure executed successfully");
    } catch (sqlError: any) {
      console.error("SQL Error:", sqlError);
      return NextResponse.json(
        { error: `Database error: ${sqlError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Client archived successfully" });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}