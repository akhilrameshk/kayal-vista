import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import Message from '@/models/Message';

export async function GET() {
  try {
    await connectToDatabase();
    // Fetch messages sorted by newest first
    const messages = await Message.find().sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("MESSAGES_FETCH_ERROR:", error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}