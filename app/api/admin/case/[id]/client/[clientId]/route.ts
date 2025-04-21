import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string; clientId: string }> }
) {
  try {
    const resolvedParams = await params;
    
    await prisma.client_Case.deleteMany({
      where: {
        case_id: resolvedParams.id,
        client_id: resolvedParams.clientId
      }
    });
    
    return NextResponse.json({ message: "Client removed from case" });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Failed to remove client from case";
      
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}