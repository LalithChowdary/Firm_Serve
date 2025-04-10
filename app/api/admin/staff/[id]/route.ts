import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/client';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params before using its properties
    const resolvedParams = await params;
    const staff = await prisma.staff.findUnique({
      where: { staff_id: resolvedParams.id },
      include: { staff_auth: true },
    });

    return NextResponse.json(staff);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params before using its properties
    const resolvedParams = await params;
    const data = await request.json();
    const updatedStaff = await prisma.staff.update({
      where: { staff_id: resolvedParams.id },
      data: {
        name: data.name,
        experience: data.experience,
        phone_no: data.phone_no,
        bar_number: data.bar_number,
        address: data.address,
        specialisation: data.specialisation,
        s_role: data.s_role,
        designation: data.designation,
        image: data.image,
      },
    });
    return NextResponse.json(updatedStaff);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new NextResponse(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}