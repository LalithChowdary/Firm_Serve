import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { client_id: id },
    include: {
      client_auth: true,
      Client_Case: { include: { Cases: true } },
      Appointment_Client: {
        include: {
          Appointment: {
            include: {
              Appointment_Staff: {
                include: { Staff: true },
              },
            },
          },
        },
      },
    },
  });

  if (!client) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(client);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { name, phone_no, address, image } = await req.json();

  const updateData: {
    name: string;
    phone_no: string;
    address: string;
    image?: string | null;
  } = { name, phone_no, address };

  if (typeof image === "string" && image.length > 0) {
    updateData.image = image;
  }

  const updated = await prisma.client.update({
    where: { client_id: id },
    data: updateData,
  });

  return NextResponse.json(updated);
}