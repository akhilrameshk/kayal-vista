/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

// Separate, dedicated Dummy Inventory for Room Categories
const DUMMY_ROOMS = [
  // --- PREMIUM AC ROOMS ---
  {
    _id: 'rm-ac-1',
    name: 'Lakeview Premium AC Suite',
    type: 'AC Room',
    rooms: 1,
    guests: 2,
    basePrice: 4500,
    images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600']
  },
  {
    _id: 'rm-ac-2',
    name: 'Heritage Canal Side AC Room',
    type: 'AC Room',
    rooms: 1,
    guests: 3,
    basePrice: 5200,
    images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600']
  },

  // --- STANDARD NORMAL ROOMS ---
  {
    _id: 'rm-nr-1',
    name: 'Backwater Breeze Standard Room',
    type: 'Normal Room',
    rooms: 1,
    guests: 2,
    basePrice: 2200,
    images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600']
  },

  // --- SHARED DORMITORIES ---
  {
    _id: 'rm-dm-1',
    name: 'Kayal Vista Backpacker Bunks',
    type: 'Dormitory',
    rooms: 1,
    guests: 10,
    basePrice: 750,
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600']
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    // Date validation loop to match your existing boat logic structure
    if (!start || !end) {
      return NextResponse.json(
        { error: 'Missing duration parameters: start & end are required.' }, 
        { status: 400 }
      );
    }

    // Returns purely the rooms list array to your frontend tabs filter
    return NextResponse.json(DUMMY_ROOMS, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to aggregate rooms inventory payload.', details: error.message }, 
      { status: 500 }
    );
  }
}