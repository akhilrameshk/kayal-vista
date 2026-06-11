/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import Booking from '@/models/Booking'; 
import Availability from '@/models/Availability'; // Import your new availability model
import { connectToDatabase } from '@/utils/db';
import { Resend } from 'resend';
import twilio from 'twilio';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();
    
    // Log exactly what payload arrived from the frontend form submission
    console.log("=== 1. INCOMING REQUEST PAYLOAD ===");
    console.log(JSON.stringify(data, null, 2));
    console.log("====================================");

    // 1. Save to Booking DB Collection
    const newBooking = await Booking.create(data);
    
    // 2. Synchronize Blocks to Availability DB Collection
    try {
      const { boatId, travelDate } = data;

      if (!boatId || !travelDate) {
        console.warn("⚠️ Skipping Availability Block: boatId or travelDate missing in payload.");
      } else {
        // Enforce an array conversion even if travelDate comes in as a single string
        const datesToBlock = Array.isArray(travelDate) ? travelDate : [travelDate];

        // $addToSet cleanly inserts dates without creating duplicate elements
        // upsert: true handles cases where the boat does not have an availability document yet
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
      // Caught separately so notification pipelines and booking completions aren't disrupted by lookups
      console.error("❌ Failed to automatically sync availability blocks table:", availError);
    }
    
    // 3. Notification Dispatch Block
    try {
      const { customer, boatName, travelDate, totalPrice } = data;

      if (customer?.email || customer?.phone) {
        
        // Prepare Email Promise (Resend)
        const emailPromise = (async () => {
          const resendKey = process.env.RESEND_API_KEY;
          if (!resendKey || !customer.email) {
            console.warn("⚠️ Skipping Email: RESEND_API_KEY or customer email missing.");
            return;
          }
          
          const resend = new Resend(resendKey);
          await resend.emails.send({
            from: 'Kayal Vista <onboarding@resend.dev>',
            to: customer.email,
            subject: 'Booking Confirmed! 🚢',
            html: `
              <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2>Booking Confirmed!</h2>
                <p>Hi ${customer.name},</p>
                <p>Your houseboat booking is successfully locked in. Here are your trip details:</p>
                <hr style="border: none; border-top: 1px solid #eee;" />
                <p><strong>Houseboat:</strong> ${boatName || 'Premium Houseboat'}</p>
                <p><strong>Travel Date:</strong> ${travelDate}</p>
                <p><strong>Total Amount Paid:</strong> ₹${totalPrice.toFixed(2)}</p>
                <hr style="border: none; border-top: 1px solid #eee;" />
                <p>Thank you for booking with Kayal Vista. See you soon!</p>
              </div>
            `
          });
          console.log("✉️ Resend email request completed.");
        })();

        // Prepare WhatsApp Promise (Twilio Sandbox Compliant with deep logging)
        const whatsappPromise = (async () => {
          const accountSid = process.env.TWILIO_ACCOUNT_SID;
          const authToken = process.env.TWILIO_AUTH_TOKEN;
          
          console.log("=== 3. TWILIO CONFIGURATION & DATA CHECK ===");
          console.log("TWILIO_ACCOUNT_SID Exists:", !!accountSid, accountSid ? `(${accountSid.substring(0, 4)}...)` : '');
          console.log("TWILIO_AUTH_TOKEN Exists:", !!authToken);
          console.log("Customer Phone String:", customer?.phone ? `"${customer.phone}"` : "UNDEFINED/EMPTY");
          console.log("============================================");

          if (!accountSid || !authToken || !customer?.phone) {
            console.error("🛑 WHATSAPP ABSOLUTELY CANCELED: Conditions not met. Exiting dispatch handler.");
            return;
          }
          
          // Initialize Twilio client instance
          const twilioClient = twilio(accountSid, authToken);
          
          // Clean up any user-submitted formatting layout options
          const cleanRawPhone = customer.phone.replace(/[\s\-()]/g, '');
          const cleanPhone = cleanRawPhone.startsWith('+') ? cleanRawPhone : `+91${cleanRawPhone}`;
          const sandboxNumber = process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886';

          console.log(`🚀 Triggering Twilio API Request -> to: whatsapp:${cleanPhone} | from: whatsapp:${sandboxNumber}`);

          try {
            const message = await twilioClient.messages.create({
              from: `whatsapp:${sandboxNumber}`,
              to: `whatsapp:${cleanPhone}`,
              body: `Your booking confirmation code for ${boatName || 'Premium Houseboat'} is active. Your check-in is scheduled for ${travelDate}. Total Paid: ₹${totalPrice.toFixed(2)}.`
            });
            console.log(`✅ Twilio accepted payload. Message SID assigned: ${message.sid}`);
          } catch (twilioApiError) {
            console.error("❌ Twilio API Engine Rejected transmission directly:", twilioApiError);
          }
        })();

        // Run notifications concurrently without hanging up server resolution timelines
        await Promise.allSettled([emailPromise, whatsappPromise]);
      } else {
        console.warn("⚠️ Both customer.email and customer.phone are completely missing from request payload context.");
      }
    } catch (notifError) {
      console.error("Background communications channel failed:", notifError);
    }
    
    return NextResponse.json({ success: true, bookingId: newBooking._id });
  } catch (error) {
    console.error("Save Booking Error:", error);
    return NextResponse.json({ success: false, error: "Failed to save" }, { status: 500 });
  }
}