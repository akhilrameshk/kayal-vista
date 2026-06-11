import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import Message from '@/models/Message';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newMessage = await Message.create({ name, email, message });

    return NextResponse.json({ 
      success: true, 
      message: 'Inquiry saved successfully',
      data: newMessage 
    });
  } catch (error) {
    console.error("CONTACT_API_ERROR:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}