import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import Boat from '@/models/Boat';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization credentials missing.' }, { status: 401 });
    }

    // Decoding the token
    const tokenData = JSON.parse(atob(authHeader));
    const { id: ownerId } = tokenData;

    await connectToDatabase();
    const body = await req.json();

    // Explicitly destructure body to ensure images are passed
    const { name, licenseNumber, type, rooms, capacity, basePrice, images } = body;

    const newBoat = await Boat.create({
      name,
      licenseNumber,
      type,
      rooms: Number(rooms),
      capacity: Number(capacity),
      basePrice: Number(basePrice),
      images: images || [], // Ensure this is saved
      ownerId: ownerId,
      status: 'PENDING'
    });

    return NextResponse.json({ success: true, boat: newBoat }, { status: 201 });
  } catch (error) {
    console.error('Error creating boat:', error);
    return NextResponse.json({ error: 'Failed to create boat. Ensure all fields are provided.' }, { status: 500 });
  }
}