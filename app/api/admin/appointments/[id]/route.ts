import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/client';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params before using its properties
    const resolvedParams = await params;
    const staff = await prisma.appointment.findUnique({
      where: { appointment_id: resolvedParams.id },
      include: {
        Appointment_Client: {
          include: {
            Client:true,
          },
        },
        Appointment_Staff: {
          include: {
            Staff: true,
          },
        },
        Cases:true,
      },
    });


    return NextResponse.json(staff);
  } catch (error) {
    console.error("Error in GET /api/admin/staff/[id]:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}