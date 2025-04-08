

import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET() {
  const staffList = await prisma.expense.findMany({
    include: {
      Staff: true,
    },
  });
  return NextResponse.json(staffList);
}