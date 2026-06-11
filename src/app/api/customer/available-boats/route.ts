/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import mongoose from 'mongoose';
import Boat from '@/models/Boat';
import Booking from '@/models/Booking';
import Availability from '@/models/Availability'; 
import { User } from '@/models/User'; 

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    
    if (!mongoose.models.User) {
      mongoose.model('User', User.schema);
    }

    const { searchParams } = new URL(req.url);
    const startParam = searchParams.get('start'); 
    const endParam = searchParams.get('end');     

    console.log("\n========================================================");
    console.log("=== [1] INCOMING SEARCH PARAMETERS ===");
    console.log(`Raw URL Params -> start: "${startParam}", end: "${endParam}"`);
    console.log("========================================================");

    if (!startParam || !endParam) {
      return NextResponse.json({ error: 'Start and end dates are required' }, { status: 400 });
    }

    // --- 1. LEGACY BOOKINGS CHECK ---
    const startDate = new Date(startParam);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(endParam);
    endDate.setUTCHours(23, 59, 59, 999);

    const bookedBoatIds = await Booking.find({
      travelDate: { 
        $gte: startDate, 
        $lte: endDate 
      },
      status: 'COMPLETED'
    }).distinct('boatId');

    console.log("=== [2] LEGACY COMPLETED BOOKINGS INDICES ===");
    console.log("Matched Boat IDs from Booking Table:", bookedBoatIds.map(id => id.toString()));


    // --- 2. HYBRID FORMAT STRING GENERATOR FOR AVAILABILITY TABLE ---
    const searchDateStrings: string[] = [];

    const cleanStartStr = startParam.split('T')[0];
    const cleanEndStr = endParam.split('T')[0];

    const [sYear, sMonth, sDay] = cleanStartStr.split('-').map(Number);
    const [eYear, eMonth, eDay] = cleanEndStr.split('-').map(Number);

    let currentDay = new Date(Date.UTC(sYear, sMonth - 1, sDay));
    const lastDay = new Date(Date.UTC(eYear, eMonth - 1, eDay));

    const pad = (num: number) => String(num).padStart(2, '0');

    while (currentDay <= lastDay) {
      const day = pad(currentDay.getUTCDate());
      const month = pad(currentDay.getUTCMonth() + 1);
      const year = currentDay.getUTCFullYear();

      // 🔹 Push BOTH formats to be 100% database schema agnostic
      searchDateStrings.push(`${day}-${month}-${year}`); // Format: dd-MM-yyyy
      searchDateStrings.push(`${year}-${month}-${day}`); // Format: yyyy-MM-dd
      
      currentDay.setUTCDate(currentDay.getUTCDate() + 1);
    }

    // Remove duplicates just to keep the log clean
    const uniqueSearchStrings = [...new Set(searchDateStrings)];

    console.log("=== [3] GENERATED LOOKUP STRINGS CHANGELOG ===");
    console.log("Looking for any of these strings inside Availability docs:", uniqueSearchStrings);


    // Find boatId entries that have any overlapping dates inside their blockedDates array
    const manuallyBlockedBoatIds = await Availability.find({
      blockedDates: { $in: uniqueSearchStrings }
    }).distinct('boatId');

    console.log("=== [4] AVAILABILITY TABLE MATCHES ===");
    console.log("Matched Boat IDs from Availability Table:", manuallyBlockedBoatIds.map(id => id.toString()));


    // --- 3. UNIFIED TYPE CASTING FIXED PIPELINE ---
    const stringExclusions = [
      ...new Set([
        ...bookedBoatIds.map(id => id.toString()), 
        ...manuallyBlockedBoatIds.map(id => id.toString())
      ])
    ];

    const objectIdExclusions = stringExclusions.map(id => new mongoose.Types.ObjectId(id));

    console.log("=== [5] MASTER COMPACT EXCLUSION LIST ===");
    console.log("Total Boat IDs hidden from this search query range:", stringExclusions);
    console.log("========================================================\n");


    // Fetch boats that are ACTIVE and NOT matching our explicit ObjectIds array
    const availableBoats = await Boat.find({
      _id: { $nin: objectIdExclusions },
      status: 'ACTIVE'
    }).populate('ownerId', 'fullName');

    const result = availableBoats.map((boat: any) => ({
      ...boat.toObject(),
      ownerName: boat.ownerId?.fullName || 'Independent Operator'
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ CRITICAL CRASH IN AVAILABILITY ENGINE:", error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}