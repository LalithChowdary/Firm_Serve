import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/client';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params before using its properties
    const resolvedParams = await params;
    const expense = await prisma.expense.findUnique({
      where: { expense_id: resolvedParams.id },
      include: {
        Staff: true,
      },
    });

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(expense);
  } catch (error) {
    console.error("Error in GET /api/admin/expences/[id]:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}