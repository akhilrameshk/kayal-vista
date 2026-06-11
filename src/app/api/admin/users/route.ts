/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import { User } from '@/models/User';

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    // Read the authorization headers to verify permissions
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header missing.' }, { status: 401 });
    }

    // Decode our custom base64 token setup
    const tokenData = JSON.parse(atob(authHeader));
    if (tokenData.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Access denied. Administrative rights required.' }, { status: 403 });
    }

    // Fetch users from the collection, explicitly excluding passwords for security
    const usersList = await User.find({}, '-password').sort({ createdAt: -1 });

    return NextResponse.json({ success: true, users: usersList });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to pull collections.' }, { status: 500 });
  }
}