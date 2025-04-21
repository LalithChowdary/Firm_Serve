import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { staffId } = await req.json();
    
    const staffCase = await prisma.staff_Case.create({
      data: {
        staff_id: staffId,
        case_id: resolvedParams.id
      }
    });
    
    return NextResponse.json(staffCase);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add staff to case" },
      { status: 500 }
    );
  }
}