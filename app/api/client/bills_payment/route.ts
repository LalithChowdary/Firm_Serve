import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";



export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    
    try {
        // Try session first, then fall back to query param (for testing)
        const clientID = session?.user?.id ;

        if (!clientID) {
            return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
        }

        // Find all cases associated with the staff ID
        const cases = await prisma.billing.findMany({
            where: {
                client_id: clientID,
            },
            include: {
                Client:true,
                Cases : true
            },
            
            
        });
        
        //console.log('Cases fetched:', cases);
        return NextResponse.json(cases);
    } catch (error) {
        console.error('Error fetching cases:', error);
        return NextResponse.json({ error: 'Failed to fetch cases' }, { status: 500 });
    }
}