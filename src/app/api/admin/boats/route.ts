/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
// Correct way to import a 'default' export
import Boat from '@/models/Boat';
import { User } from '@/models/User';

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    // 1. Extract and read incoming validation signatures
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization token configuration missing.' }, { status: 401 });
    }

    // Decode our base64 token string
    const tokenData = JSON.parse(atob(authHeader));
    const { id: userId, role: userRole } = tokenData;

    // 2. Establish dynamic query filter criteria based on identity
    let databaseQueryFilter = {};

    if (userRole === 'SUPER_ADMIN') {
      // Super Admin sees everything across the network cluster
      databaseQueryFilter = {}; 
    } else if (userRole === 'BOAT_OWNER') {
      // Boat Owner is strictly filtered to their matching record ownership ID
      databaseQueryFilter = { ownerId: userId };
    } else {
      // Standard travelers or anonymous requests are rejected instantly
      return NextResponse.json({ error: 'Access denied. Level permissions missing.' }, { status: 403 });
    }

    // 3. Query the database using our dynamic filter rule
    const filteredBoatsList = await Boat.find(databaseQueryFilter)
      .populate('ownerId', 'fullName contactDetails')
      .sort({ createdAt: -1 });

    return NextResponse.json({ 
      success: true, 
      roleScope: userRole, 
      boats: filteredBoatsList 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server processing error.' }, { status: 500 });
  }
}