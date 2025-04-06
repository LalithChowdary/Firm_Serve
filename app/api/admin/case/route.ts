

import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET() {
  const staffList = await prisma.cases.findMany({
    include: {
      Client_Case: {
        include: {
          Client: {
            include: {
              client_auth: true,
            },
          },
        },
      },
      Staff_Case: {
        include: {
          Staff: true,
        },
      },
    },
  });
  return NextResponse.json(staffList);
}