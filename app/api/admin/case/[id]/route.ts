import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/client';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params before using its properties
    const resolvedParams = await params;
    const caseData = await prisma.cases.findUnique({
      where: { case_id: resolvedParams.id },
      include: {
        Client_Case: {
          include: {
            Client: true,
          },
        },
        Staff_Case: {
          include: {
            Staff: true,
          },
        },
        Appointment: true,
      },
    });

    return NextResponse.json(caseData);
  } catch (error) {
    console.error("Error in GET /api/admin/case/[id]:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { status } = await req.json();
    
    const updatedCase = await prisma.cases.update({
      where: { case_id: resolvedParams.id },
      data: { status }
    });
    
    return NextResponse.json(updatedCase);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update case" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    
    // Call the stored procedure to archive the case
    await prisma.$executeRawUnsafe(
      "CALL sp_archive_case(?)",
      resolvedParams.id
    );
    
    return NextResponse.json({ message: "Case archived successfully" });
  } catch (error: any) {
    console.error("Error archiving case:", error);
    return NextResponse.json(
      { error: error.message || "Failed to archive case" },
      { status: 500 }
    );
  }
}