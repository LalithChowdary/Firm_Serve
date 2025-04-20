import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { staffId, action, newStaffId, clientId } = await req.json();
    
    console.log("Procedure call params:", { staffId, action, newStaffId, clientId });

    // Validate inputs
    if (!staffId || !action || !clientId) {
      return NextResponse.json(
        { error: "Missing required fields (staffId, action, clientId)" },
        { status: 400 }
      );
    }

    if (action !== 'reassign' && action !== 'past client') {
      return NextResponse.json(
        { error: "Action must be either 'reassign' or 'past client'" },
        { status: 400 }
      );
    }

    // Call the stored procedure using executeRawUnsafe
    await prisma.$executeRawUnsafe(
      "CALL sp_remove_staff(?, ?, ?, ?)",
      staffId,
      action,
      newStaffId || null,
      clientId
    );
    
    return NextResponse.json({ 
      success: true,
      message: action === 'reassign' 
        ? `Client ${clientId} reassigned to staff ${newStaffId}` 
        : `Client ${clientId} marked as past client`
    });
  } catch (error) {
    // Detailed error handling
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error("Procedure call failed:", message);
    
    return NextResponse.json({ 
      error: message,
      details: "Error executing sp_remove_staff procedure"
    }, { status: 500 });
  }
}