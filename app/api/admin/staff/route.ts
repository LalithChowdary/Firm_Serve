import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";

const staffSchema = z.object({
  name: z.string().min(1),
  experience: z.number().min(0).optional().default(0),
  phone_no: z.string().min(1),
  bar_number: z.string().optional().default(""),
  address: z.string().optional().default(""),
  specialisation: z.string().optional().default(""),
  s_role: z.string().optional().default(""),
  designation: z.string().optional().default(""),
  image: z.string().optional().default(""),
  email: z.string().email(),
  password: z.string().min(5),
});

export async function GET() {
  const staffList = await prisma.staff.findMany({
    include: {
      staff_auth: true,
    },
  });
  return NextResponse.json(staffList);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = staffSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      name,
      experience,
      phone_no,
      bar_number,
      address,
      specialisation,
      s_role,
      designation,
      image,
      email,
      password,
    } = parsed.data;

    // check for existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    // hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        role: "STAFF",
      },
    });

    // create staff record pointing to user.id
    const staff = await prisma.staff.create({
      data: {
        staff_id: user.id,
        name,
        experience,
        phone_no,
        bar_number,
        address,
        specialisation,
        s_role,
        designation,
        image,
        status: "working",
      },
    });

    return NextResponse.json(staff, { status: 201 });
  } catch (err: unknown) {
    console.error("Error creating staff:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: message || "Internal error" },
      { status: 500 }
    );
  }
}