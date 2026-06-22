/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import Booking from '@/models/Booking';
import Boat from '@/models/Boat'; 
import { User } from '@/models/User'; // Imported to fetch customer email & phone records
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    // 1. EXTRACT AUTHORIZATION PARAMETERS FROM INCOMING HEADERS
    const authHeader: any = req.headers.get('authorization');
    let userId: string | null = null;
    
    if (authHeader) {
      try {
        const tokenData = JSON.parse(atob(authHeader));
        console.log("🔐 Decoded Token Data:", tokenData); // Debug log to verify token structure
        userId = tokenData.id || tokenData._id || tokenData.userId;
      } catch (e) {
        console.warn("⚠️ Failed to parse custom authorization string header:", e);
      }
    }

    // 2. BACKWARD COMPATIBLE FALLBACK
    if (!userId) {
      const { searchParams } = new URL(req.url);
      userId = searchParams.get('userId');
    }

    // Enforce parameter validation rules before running lookup processes
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ 
        error: 'Missing identity vectors. Provide a Bearer token or tracking parameter identification.' 
      }, { status: 400 });
    }

    // 3. FETCH USER DATA RECORDS TO EXTRACT TARGET REFS (EMAIL & PHONE)
    const userProfile = await User.findById(userId).lean();
    if (!userProfile) {
      return NextResponse.json({ 
        error: 'No registered customer account found matching the decoded identity metrics.' 
      }, { status: 404 });
    }

    // Extract values matching your User schema property names
    const userEmail = userProfile.email;
    const userPhone = userProfile.contactDetails || userProfile.phone;

    // Force Mongoose to register your Boat schema to prevent model resolution errors during populate
    if (!mongoose.models.Boat) {
      mongoose.model('Boat', Boat.schema);
    }

    // 4. FETCH RESERVATIONS LOOKING UP EMAIL OR PHONE MATCHES INSIDE THE CUSTOMER OBJECT
    console.log(`🔍 Retrieving bookings matching user data -> Email: ${userEmail} | Phone: ${userPhone}`);
    
    const customerBookings = await Booking.find({
      $or: [
        { 'customer.email': userEmail },
        { 'customer.phone': userPhone }
      ]
    })
    .populate({
      path: 'boatId',
      select: 'name title type category images basePrice price specifications'
    })
    .sort({ createdAt: -1 })
    .lean(); // Converts Mongoose Documents to plain objects for safer mapping operations

    // 5. DATA-CAST ENGINE (Converts dates stored inside the DB to readable text strings)
    const formattedBookings = customerBookings.map((booking: any) => {
      let dynamicDatesList: string[] = [];

      if (booking.travelDate) {
        const structuralDates = Array.isArray(booking.travelDate) ? booking.travelDate : [booking.travelDate];
        dynamicDatesList = structuralDates.map((dateObj: any) => {
          if (dateObj instanceof Date) {
            return `${String(dateObj.getDate()).padStart(2, '0')}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${dateObj.getFullYear()}`;
          }
          if (typeof dateObj === 'string') {
            // If it's an ISO timestamp text sequence, clean it up cleanly
            if (dateObj.includes('T')) {
              const d = new Date(dateObj);
              if (!isNaN(d.getTime())) {
                return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
              }
            }
            return dateObj;
          }
          // Handle nested MongoDB specific $date format if present in plain json objects
          if (dateObj && typeof dateObj === 'object' && dateObj.$date) {
            const d = new Date(dateObj.$date);
            if (!isNaN(d.getTime())) {
              return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
            }
          }
          return String(dateObj);
        });
      }

      return {
        ...booking,
        travelDate: dynamicDatesList // Standardizes into client-friendly 'DD-MM-YYYY' arrays
      };
    });

    return NextResponse.json({
      success: true,
      count: formattedBookings.length,
      data: formattedBookings
    });

  } catch (error: any) {
    console.error("❌ BACKEND ERROR RESOLVING CUSTOMER BOOKINGS PANEL:", error);
    return NextResponse.json({ error: 'Internal server breakdown assembling reservation history' }, { status: 500 });
  }
}