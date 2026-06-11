import { Resend } from 'resend';
import twilio from 'twilio';

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key');

// Match your true data layout structure
interface NotificationPayload {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  boatName: string;
  travelDate: string;
  totalPrice: number;
}

export async function sendBookingNotifications(data: NotificationPayload) {
  const { customer, boatName, travelDate, totalPrice } = data;

  // 1. Email Promise
  const emailPromise = (async () => {
    try {
      if (!process.env.RESEND_API_KEY || !customer?.email) return;
      await resend.emails.send({
        from: 'Kayal Vista <onboarding@resend.dev>',
        to: customer.email,
        subject: 'Booking Confirmed! 🚢',
        html: `<p>Hi ${customer.name},</p><p>Your booking for <strong>${boatName}</strong> on <strong>${travelDate}</strong> is confirmed.</p>`
      });
    } catch (e) {
      console.error("Email failed:", e);
    }
  })();

  // 2. WhatsApp Promise
  const whatsappPromise = (async () => {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      
      if (!accountSid || !authToken || !customer?.phone) {
        console.warn("Skipping WhatsApp dispatch: Missing phone number property.");
        return;
      }
      
      const twilioClient = twilio(accountSid, authToken);
      const cleanRawPhone = customer.phone.replace(/[\s\-()]/g, '');
      const cleanPhone = cleanRawPhone.startsWith('+') ? cleanRawPhone : `+91${cleanRawPhone}`;
      const sandboxNumber = process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886';
console.log(`Attempting WhatsApp message to ${cleanPhone} via Twilio sandbox ${sandboxNumber}`);
      await twilioClient.messages.create({
        from: `whatsapp:${sandboxNumber}`,
        to: `whatsapp:${cleanPhone}`,
        body: `Your booking confirmation code for ${boatName || 'Premium Houseboat'} is active. Your check-in is scheduled for ${travelDate}. Total Paid: ₹${totalPrice.toFixed(2)}.`
      });
    } catch (e) {
      console.error("WhatsApp notification failed:", e);
    }
  })();

  await Promise.allSettled([emailPromise, whatsappPromise]);
}