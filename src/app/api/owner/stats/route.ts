/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import  Boat  from '@/models/Boat';

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    // 1. Validate session handshake parameters
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization credentials missing.' }, { status: 401 });
    }

    const tokenData = JSON.parse(atob(authHeader));
    const { id: ownerId, role: userRole } = tokenData;

    if (userRole !== 'BOAT_OWNER') {
      return NextResponse.json({ error: 'Access restricted to active fleet operators.' }, { status: 403 });
    }

    // 2. Fetch fleet information specifically matching this owner ID
    const ownerBoats = await Boat.find({ ownerId });

    // 3. Compute real-time metric counts
    const totalBoats = ownerBoats.length;
    const activeBoats = ownerBoats.filter(b => b.status === 'ACTIVE').length;
    const maintenanceBoats = ownerBoats.filter(b => b.status === 'MAINTENANCE').length;
    
    // Simple placeholder logic for fleet valuation metrics based on base hourly/daily rates
    const estimatedDailyCapacity = ownerBoats
      .filter(b => b.status === 'ACTIVE')
      .reduce((sum, b) => sum + (b.basePrice || 0), 0);

    return NextResponse.json({
      success: true,
      statistics: {
        totalBoats,
        activeBoats,
        maintenanceBoats,
        estimatedDailyCapacity
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to aggregate fleet counters.' }, { status: 500 });
  }
}