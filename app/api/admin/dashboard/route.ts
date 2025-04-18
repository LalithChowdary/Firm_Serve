import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET() {
  try {
    const clientList = await prisma.client.findMany();
    const staffList = await prisma.staff.findMany();
    const caseList = await prisma.cases.findMany();
    const appointmentList = await prisma.appointment.findMany();
    const billsList = await prisma.billing.findMany();

    const allData = {
      clients: clientList,
      staff: staffList,
      cases: caseList,
      appointments: appointmentList,
      bills: billsList,
    };

    return NextResponse.json(allData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}