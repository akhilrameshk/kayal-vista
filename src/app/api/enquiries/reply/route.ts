import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import Message from '@/models/Message';
import { Resend } from 'resend';

// Initialize Resend with your environment token
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { enquiryId, customerEmail, customerName, replyMessage } = await req.json();

    if (!enquiryId || !customerEmail || !replyMessage) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // 1. Dispatch the official email response using your custom domain
    await resend.emails.send({
      from: 'Kayal Vista Support <onboarding@resend.dev>',
      to: customerEmail,
      subject: `Re: Your Inquiry with Kayal Vista`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; color: #333;">
          <p>Dear ${customerName || 'Guest'},</p>
          <p>Thank you for reaching out to Kayal Vista. Here is the response from our operations team regarding your inquiry:</p>
          <blockquote style="border-left: 4px solid #004d40; padding-left: 15px; margin: 20px 0; color: #555; font-style: italic;">
            "${replyMessage}"
          </blockquote>
          <p>If you have further questions, feel free to reply directly to this email or contact us at info@kayalvista.in.</p>
          <br />
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #777;"><strong>Kayal Vista Crew</strong><br />Finishing Point, Punnamada, Alappuzha, Kerala</p>
        </div>
      `
    });

    // 2. Update status and append tracking indicators inside the database schema document
    const updatedEnquiry = await Message.findByIdAndUpdate(
      enquiryId,
      { 
        status: 'RESOLVED',
        replyText: replyMessage, // Stores historical trace data inside MongoDB
        repliedAt: new Date()
      },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updatedEnquiry });
  } catch (error) {
    console.error("❌ CRITICAL FAILURE IN ENQUIRY REPLY ENGINE:", error);
    return NextResponse.json({ error: 'Failed to process email dispatch operations' }, { status: 500 });
  }
}