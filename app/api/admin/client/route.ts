

import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET() {
  const staffList = await prisma.client.findMany({
    include: {
      client_auth: true,
    },
  });
  return NextResponse.json(staffList);
}