/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import Booking from '@/models/Booking';
import Boat from '@/models/Boat';

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    // 1. Extract and read incoming validation signatures
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization token configuration missing.' }, { status: 401 });
    }

    // Decode our base64 token string (consistent with your Boat list API)
    const tokenData = JSON.parse(atob(authHeader));
    const { id: userId, role: userRole } = tokenData;

    // 2. Establish dynamic query filter criteria based on identity
    let databaseQueryFilter: any = {};

    if (userRole === 'SUPER_ADMIN') {
      // Super Admin sees every booking in the system
      databaseQueryFilter = {};
    } else if (userRole === 'BOAT_OWNER') {
      // Find boats owned by this user, then filter bookings linked to those boat IDs
      const myBoats = await Boat.find({ ownerId: userId }).select('_id');
      const myBoatIds = myBoats.map((boat) => boat._id);
      
      databaseQueryFilter = { boatId: { $in: myBoatIds } };
    } else {
      return NextResponse.json({ error: 'Access denied. Level permissions missing.' }, { status: 403 });
    }

    // 3. Query the bookings database
    const filteredBookingsList = await Booking.find(databaseQueryFilter)
      .populate('boatId', 'name') // Populate boat name for reference
      .sort({ createdAt: -1 });

    return NextResponse.json({ 
      success: true, 
      roleScope: userRole, 
      bookings: filteredBookingsList 
    });

  } catch (error: any) {
    console.error("Booking API Error:", error);
    return NextResponse.json({ error: error.message || 'Server processing error.' }, { status: 500 });
  }
}