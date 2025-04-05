

import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET() {
  const staffList = await prisma.staff.findMany({
    include: {
      staff_auth: true,
    },
  });
  return NextResponse.json(staffList);
}