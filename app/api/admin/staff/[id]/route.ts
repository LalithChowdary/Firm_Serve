import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/client';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const staff = await prisma.staff.findUnique({
      where: { staff_id: params.id },
      include: { staff_auth: true },
    });

    return NextResponse.json(staff);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const updatedStaff = await prisma.staff.update({
      where: { staff_id: params.id },
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
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}