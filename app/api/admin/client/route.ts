import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET() {
  const clients = await prisma.client.findMany({
    where: {
      OR: [
        { status: { not: 'PAST CLIENT' } },
        { status: null },
        { status: '' }
      ]
    },
    include: {
      client_auth: true
    }
  });
  
  console.log(`Found ${clients.length} active clients`);
  return NextResponse.json(clients);
}