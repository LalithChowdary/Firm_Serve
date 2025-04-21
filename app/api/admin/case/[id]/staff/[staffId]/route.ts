import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string; staffId: string }> }
) {
  try {
    const resolvedParams = await params;
    
    await prisma.staff_Case.deleteMany({
      where: {
        case_id: resolvedParams.id,
        staff_id: resolvedParams.staffId
      }
    });
    
    return NextResponse.json({ message: "Staff removed from case" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to remove staff from case" },
      { status: 500 }
    );
  }
}