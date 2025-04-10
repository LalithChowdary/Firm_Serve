import { prisma } from "@/prisma/client";
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/components/authOptions"; 



export async function GET() {
    const session = await getServerSession(authOptions);
    
    try {
        // Try session first, then fall back to query param (for testing)
        const clientID = session?.user?.id ;

        if (!clientID) {
            return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 });
        }

        // Find all cases associated with the staff ID
        const cases = await prisma.appointment.findMany({
            where: {
                Appointment_Client: {
                    some: {
                        client_id: clientID,
                    },
                },
            },
            include:{
                Appointment_Staff: {
                    include: {
                        Staff: true,
                    },
                },
                Cases: true,
            }
        });
        
        //console.log('Cases fetched:', cases);
        return NextResponse.json(cases);
    } catch (error) {
        console.error('Error fetching cases:', error);
        return NextResponse.json({ error: 'Failed to fetch cases' }, { status: 500 });
    }
}