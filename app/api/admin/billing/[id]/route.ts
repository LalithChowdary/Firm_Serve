import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/client';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params before using its properties
    const resolvedParams = await params;
    const billing = await prisma.billing.findUnique({
      where: { billing_id: resolvedParams.id },
      include: {
        Client: true,
        Cases: true,
      },
    });

    if (!billing) {
      return NextResponse.json({ error: "Billing not found" }, { status: 404 });
    }

    return NextResponse.json(billing);
  } catch (error) {
    console.error("Error in GET /api/admin/billing/[id]:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}