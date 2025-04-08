

import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET() {
  const staffList = await prisma.billing.findMany({
    include: {
      Client: true,
    },
  });
  return NextResponse.json(staffList);
}