import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

export async function GET() {
  const appointmentList = await prisma.appointment.findMany({
    include: {
      // Include the case related to this appointment
      Cases: {
        select: {
          case_id: true,
          title: true,
          status: true,
          case_type: true
        }
      },
      // Include all clients connected to this appointment
      Appointment_Client: {
        include: {
          Client: {
            select: {
              client_id: true,
              name: true,
              phone_no: true,
              // Include user email from the client_auth relation
              client_auth: {
                select: {
                  email: true
                }
              }
            }
          }
        }
      },
      
    },
    
  });
  
  return NextResponse.json(appointmentList);
}