import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import Boat from '@/models/Boat';

// Note the explicit typing for the context
export async function PUT(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    // 1. Unwrap the params Promise
    const { id } = await params;
    
    const body = await req.json();

    // 2. Perform the update 
    // Using returnDocument: 'after' as per current Mongoose/MongoDB recommendations
    const updatedBoat = await Boat.findByIdAndUpdate(id, body, { 
      returnDocument: 'after' 
    });

    if (!updatedBoat) {
      return NextResponse.json({ error: 'Vessel record not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Vessel updated successfully', 
      boat: updatedBoat 
    });
  } catch (error) {
    console.error('Update Error:', error);
    return NextResponse.json({ error: 'Failed to update vessel record' }, { status: 500 });
  }
}