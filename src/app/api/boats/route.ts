/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import Boat from '@/models/Boat';
import Booking from '@/models/Booking';
// Import the model AND the schema registration if necessary
import { User } from '@/models/User'; 

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    // Force Mongoose to recognize the User model if it hasn't already
    // This is a safety check:
    if (!require('mongoose').models.User) {
        require('@/models/User');
    }

    const { searchParams } = new URL(req.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    let query: any = { status: 'ACTIVE' };

    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const bookedBoatIds = await Booking.find({
        $or: [{ startDate: { $lte: endDate }, endDate: { $gte: startDate } }]
      }).distinct('boatId');
      
      if (bookedBoatIds.length > 0) query._id = { $nin: bookedBoatIds };
    }

    // Now, since User is registered, populate will work
    const boats = await Boat.find(query).populate('ownerId', 'fullName');

    const result = boats.map((boat: any) => ({
      ...boat.toObject(),
      ownerName: boat.ownerId?.fullName || 'Independent Operator'
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}