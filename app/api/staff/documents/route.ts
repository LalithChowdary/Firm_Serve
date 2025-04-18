import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/components/authOptions"; 

export async function GET() {
  const session = await getServerSession(authOptions);
  
  try {
    const staffId = session?.user?.id;
    if (!staffId) {
      return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 });
    }

    // Find documents whose associated Case has at least one Staff_Case record with the given staff_id
    const documents = await prisma.document.findMany({
      where: {
        Cases: {
          Staff_Case: {
            some: {
              Staff: {
                staff_id: staffId,
              },
            },
          },
        },
      },
      include: {
        Cases: true,
      },
    });
    
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}