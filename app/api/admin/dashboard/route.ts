import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET() {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const [
    appointmentsToday,
    activeCases,
    staffCount,
    clientCount,
    paidBills,
    pendingBills,
    todayAppointments,
    activeCasesList,
  ] = await Promise.all([
    prisma.appointment.count({
      where: {
        appointment_date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    }),
    prisma.cases.count({
      where: {
        status: "active",
      },
    }),
    prisma.staff.count(),
    prisma.client.count(),
    prisma.billing.count({
      where: {
        status: "Paid",
      },
    }),
    prisma.billing.count({
      where: {
        status: "Pending",
      },
    }),
    prisma.appointment.findMany({
      where: {
        appointment_date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      include: {
        Appointment_Client: {
          include: { Client: true },
        },
        Appointment_Staff: {
          include: { Staff: true },
        },
      },
    }),
    prisma.cases.findMany({
      where: {
        status: "active",
      },
      include: {
        Client_Case: true,
        Staff_Case: true,
      },
    }),
  ]);

  const formattedAppointments = todayAppointments.map((a) => ({
    id: a.appointment_id,
    purpose: a.purpose,
    location: a.location,
    date: a.appointment_date,
    clients: a.Appointment_Client.map((ac) => ac.Client.name),
    staff: a.Appointment_Staff.map((as) => as.Staff.name),
  }));

  const formattedCases = activeCasesList.map((c) => ({
    id: c.case_id,
    title: c.title,
    description: c.title,
    //client: c.Client_Case.Client.name || "N/A",
    //staff: c.Staff_Case.name || "N/A",
  }));

  return NextResponse.json({
    appointmentsToday,
    activeCases,
    staffCount,
    clientCount,
    paidBills,
    pendingBills,
    todayAppointments: formattedAppointments,
    activeCasesList: formattedCases,
  });
}