import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";

const clientSchema = z.object({
  name: z.string().min(1),
  phone_no: z.string().min(1),
  address: z.string().min(1),
  image: z.string().optional().default(""),
  email: z.string().email(),
  password: z.string().min(5),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = clientSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, phone_no, address, image, email, password } = parsed.data;

    // Check for existing user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        role: "CLIENT",
      },
    });

    // Create client record pointing to user.id
    const client = await prisma.client.create({
      data: {
        client_auth: {
          connect: { id: user.id }
        },
        name,
        phone_no,
        address,
        status: "ACTIVE",
        // image field removed since it doesn't exist in your schema
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (err: unknown) {
    console.error("Error creating client:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: message || "Internal error" },
      { status: 500 }
    );
  }
}