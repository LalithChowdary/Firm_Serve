import { prisma } from "@/prisma/client";
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/components/authOptions"; 

export async function GET() {
    const session = await getServerSession(authOptions);
    
    try {
        // Try session first, then fall back to query param (for testing)
        const clientId = session?.user?.id;

        if (!clientId) {
            return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 });
        }

        // Find all cases associated with the staff ID
        const cases = await prisma.client.findMany({
            where: {
                client_id: clientId,
            },
            include: {
                Appointment_Client: {
                    include: {
                        Appointment: true,
                    },
                },
                Client_Case: {
                    include: {
                        Cases: {
                            include: {
                                Staff_Case: {
                                    include: {
                                        Staff: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        
        //console.log('Cases fetched:', cases);
        return NextResponse.json(cases);
    } catch (error) {
        console.error('Error fetching cases:', error);
        return NextResponse.json({ error: 'Failed to fetch cases' }, { status: 500 });
    }
}