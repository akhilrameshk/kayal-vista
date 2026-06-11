/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Availability from '@/models/Availability';
import { connectToDatabase } from '@/utils/db'; // Your custom DB connection utility

export async function POST(request: Request) {
  try {
    // Invoke your project's custom database connection utility hook
    await connectToDatabase();

    const body = await request.json();
    const { boatId, dates } = body;

    // Strict parameter validation checks
    if (!boatId || !dates || !Array.isArray(dates)) {
      return NextResponse.json(
        { error: 'Missing required parameters: boatId and dates array are mandatory.' },
        { status: 400 }
      );
    }

    // Directly targets the document matching the boatId and merges the incoming dates array cleanly
    const result = await Availability.updateOne(
      { boatId: new mongoose.Types.ObjectId(boatId) },
      { 
        $addToSet: { 
          blockedDates: { $each: dates } 
        } 
      },
      { upsert: true } // Automatically handles document creation on the first instance
    );

    return NextResponse.json({
      success: true,
      message: 'Dates successfully synchronized into the availability collection.',
      count: dates.length,
      details: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        upsertedCount: result.upsertedCount,
      }
    });

  } catch (error: any) {
    console.error('Database Bulk-Block Update Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error while saving dates.' },
      { status: 500 }
    );
  }
}