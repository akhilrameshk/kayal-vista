/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import Booking from '@/models/Booking'; 
import Availability from '@/models/Availability'; 
import { User } from '@/models/User'; 
import { connectToDatabase } from '@/utils/db';
import { Resend } from 'resend';
import twilio from 'twilio';
import mongoose from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Helper function to safely parse dates from alternative string representations (like DD-MM-YYYY)
function parseIncomingDate(dateStr: any): Date | any {
  if (!dateStr || typeof dateStr !== 'string') return dateStr;
  
  // Check if string matches typical DD-MM-YYYY structure
  if (dateStr.includes('-')) {
    const segments = dateStr.split('-');
    if (segments.length === 3 && segments[0].length === 2 && segments[2].length === 4) {
      const day = parseInt(segments[0], 10);
      const month = parseInt(segments[1], 10) - 1; // JS Months are 0-indexed
      const year = parseInt(segments[2], 10);
      
      const parsedNativeDate = new Date(year, month, day);
      if (!isNaN(parsedNativeDate.getTime())) {
        return parsedNativeDate;
      }
    }
  }
  return dateStr; // Fallback to raw value let Mongoose attempt its internal cast
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();
    
    console.log("=== 1. INCOMING REQUEST PAYLOAD ===");
    console.log(JSON.stringify(data, null, 2));
    console.log("====================================");

    const { customer, boatId, travelDate, boatName, totalPrice } = data;

    // Enforce email check upfront to ensure proper account linking and routing
    if (!customer?.email) {
      return NextResponse.json({ 
        success: false, 
        error: "Customer email is required for database account initialization and booking processing" 
      }, { status: 400 });
    }

    const targetEmail = customer.email.toLowerCase().trim();
    let wasAccountAutoCreated = false;
    let fallbackGeneratedPassword = '';

    // 1. DYNAMIC USER JIT SIGNUP CHECK & SAVE ENFORCEMENT
    let user = await User.findOne({ email: targetEmail });

    if (!user) {
      wasAccountAutoCreated = true;
      fallbackGeneratedPassword = crypto.randomBytes(6).toString('hex'); 
      const hashedPassword = await bcrypt.hash(fallbackGeneratedPassword, 10);

      user = await User.create({
        fullName: customer.name || targetEmail.split('@')[0],
        username: targetEmail.split('@')[0], 
        email: targetEmail,
        contactDetails: customer.phone || 'Not Provided', 
        password: hashedPassword,
        role: 'NORMAL_USER'
      });
      console.log(`👤 JIT Profile Provisioned: Saved new user account record for ${targetEmail}`);
    } else {
      console.log(`👤 Active Profile Verified: Attached booking to existing customer record ID ${user._id}`);
    }

    // 2. INJECT USER REFERENCE & SANITIZE INVALID DATE STRINGS
    data.userId = user._id;
    if (data.customer) {
      data.customer.email = targetEmail;
    }

    // Convert travelDate schema properties safely before running Database Engine write tasks
    if (Array.isArray(data.travelDate)) {
      data.travelDate = data.travelDate.map((d: any) => parseIncomingDate(d));
    } else {
      data.travelDate = parseIncomingDate(data.travelDate);
    }

    console.log("⚙️ Parsed and sanitized payload dates successfully:", data.travelDate);

    // 3. SAVE TO BOOKING DB COLLECTION (Now completely bulletproof from date cast errors)
    const newBooking = await Booking.create(data);
    console.log(`💾 Booking locked successfully into database with ID: ${newBooking._id}`);
    
    // 4. SYNCHRONIZE BLOCKS TO AVAILABILITY DB COLLECTION
    try {
      if (!boatId || !travelDate) {
        console.warn("⚠️ Skipping Availability Block: boatId or travelDate missing in payload.");
      } else {
        const datesToBlock = Array.isArray(travelDate) ? travelDate : [travelDate];

        await Availability.updateOne(
          { boatId: new mongoose.Types.ObjectId(boatId) },
          { 
            $addToSet: { 
              blockedDates: { $each: datesToBlock } 
            } 
          },
          { upsert: true }
        );
        console.log(`🔒 Successfully locked availability for Boat ID ${boatId} on dates:`, datesToBlock);
      }
    } catch (availError) {
      console.error("❌ Failed to automatically sync availability blocks table:", availError);
    }
    
    // 5. NOTIFICATION DISPATCH BLOCK
    try {
      if (customer?.email || customer?.phone) {
        
        // Prepare Email Promise (Resend)
        const emailPromise = (async () => {
          const resendKey = process.env.RESEND_API_KEY;
          if (!resendKey || !customer.email) {
            console.warn("⚠️ Skipping Email: RESEND_API_KEY or customer email missing.");
            return;
          }
          
          const authCredentialsTemplate = wasAccountAutoCreated ? `
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; margin-top: 15px; margin-bottom: 15px;">
              <h4 style="margin-top: 0; color: #166534;">🔐 Your Customer Dashboard Access is Ready!</h4>
              <p style="margin-bottom: 5px; font-size: 14px;">An account has been configured so you can track your cruise stays, itineraries, and billing details:</p>
              <p style="margin: 2px 0; font-size: 14px;"><strong>Dashboard Login Email:</strong> ${targetEmail}</p>
              <p style="margin: 2px 0; font-size: 14px;"><strong>Temporary Password:</strong> ${fallbackGeneratedPassword}</p>
              <p style="margin-top: 8px; margin-bottom: 0; font-size: 12px; color: #15803d;"><em>You can modify this temporary password securely at any time inside your customer dashboard panel profile settings.</em></p>
            </div>
          ` : `
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin-top: 15px; margin-bottom: 15px;">
              <p style="margin: 0; font-size: 14px; color: #475569;">🚢 This reservation is securely attached to your existing account profile handle: <strong>${user.username}</strong>.</p>
            </div>
          `;
          
          try {
            const resend = new Resend(resendKey);
            const formattedPrice = typeof totalPrice === 'number' ? totalPrice.toFixed(2) : totalPrice;
            const displayDates = Array.isArray(travelDate) ? travelDate.join(', ') : travelDate;

            await resend.emails.send({
              from: 'Kayal Vista <onboarding@resend.dev>',
              to: targetEmail,
              subject: wasAccountAutoCreated ? 'Booking Confirmed & Account Created! 🚢' : 'Booking Confirmed! 🚢',
              html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; line-height: 1.6;">
                  <h2>Booking Confirmed!</h2>
                  <p>Hi ${customer.name || 'Valued Guest'},</p>
                  <p>Your backwater cruise booking is successfully saved. Here are your trip details:</p>
                  
                  <hr style="border: none; border-top: 1px solid #eee;" />
                  <p><strong>Houseboat / Vessel:</strong> ${boatName || 'Premium Houseboat'}</p>
                  <p><strong>Travel Date(s):</strong> ${displayDates}</p>
                  <p><strong>Total Amount Paid:</strong> ₹${formattedPrice}</p>
                  <hr style="border: none; border-top: 1px solid #eee;" />

                  ${authCredentialsTemplate}

                  <p style="margin-top: 20px;">Thank you for booking with Kayal Vista. See you soon in the backwaters!</p>
                </div>
              `
            });
            console.log("✉️ Resend transmission completed successfully.");
          } catch (resendSendError) {
            console.error("❌ Resend provider rejected notification deployment:", resendSendError);
          }
        })();

        // Prepare WhatsApp Promise (Twilio Sandbox Compliant)
        const whatsappPromise = (async () => {
          const accountSid = process.env.TWILIO_ACCOUNT_SID;
          const authToken = process.env.TWILIO_AUTH_TOKEN;
          
          if (!accountSid || !authToken || !customer?.phone) {
            console.warn("🛑 WHATSAPP SKIPPED: Twilio environment configurations missing.");
            return;
          }
          
          try {
            const twilioClient = twilio(accountSid, authToken);
            const cleanRawPhone = customer.phone.replace(/[\s\-()]/g, '');
            const cleanPhone = cleanRawPhone.startsWith('+') ? cleanRawPhone : `+91${cleanRawPhone}`;
            const sandboxNumber = process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886';
            const displayPrice = typeof totalPrice === 'number' ? totalPrice.toFixed(2) : totalPrice;
            const displayDates = Array.isArray(travelDate) ? travelDate.join(', ') : travelDate;

            await twilioClient.messages.create({
              from: `whatsapp:${sandboxNumber}`,
              to: `whatsapp:${cleanPhone}`,
              body: `Your booking confirmation code for ${boatName || 'Premium Houseboat'} is active. Your check-in is scheduled for ${displayDates}. Total Paid: ₹${displayPrice}.`
            });
            console.log(`✅ Twilio accepted WhatsApp transmission schema.`);
          } catch (twilioApiError) {
            console.error("❌ Twilio API Engine Rejected transmission directly:", twilioApiError);
          }
        })();

        await Promise.allSettled([emailPromise, whatsappPromise]);
      }
    } catch (notifError) {
      console.error("⚠️ Background notification routing layer warning:", notifError);
    }
    
    return NextResponse.json({ 
      success: true, 
      bookingId: newBooking._id,
      autoCreated: wasAccountAutoCreated 
    });
  } catch (error: any) {
    console.error("❌ Critical Save Booking Operation Failure:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to process booking workflow",
      details: error.message || error
    }, { status: 500 });
  }
}