/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import { User } from '@/models/User';
import { seedSuperAdmin } from '@/utils/seedAdmin';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    await seedSuperAdmin(); // Automatically seed admin if collection is empty

    const body = await request.json();
    const { action, username, password, fullName, email, contactDetails, role } = body;

    // ================== OPERATION 1: USER SIGN IN ==================
    if (action === 'login') {
      if (!username || !password) {
        return NextResponse.json({ error: 'Missing credential strings.' }, { status: 400 });
      }

      const foundUser = await User.findOne({ username: username.toLowerCase() });
      if (!foundUser || foundUser.password !== password) {
        return NextResponse.json({ error: 'Invalid username or password configuration.' }, { status: 401 });
      }

      // Generate a simulated crypt-token string encapsulating live operational details
      const sessionToken = btoa(JSON.stringify({ id: foundUser._id, role: foundUser.role, exp: Date.now() + 7200000 }));

      return NextResponse.json({
        success: true,
        token: sessionToken,
        user: {
          name: foundUser.fullName,
          role: foundUser.role,
        },
      });
    }

    // ================== OPERATION 2: NEW USER REGISTRATION ==================
    if (action === 'register') {
      if (username.toLowerCase() === 'admin') {
        return NextResponse.json({ error: 'The handle "admin" is reserved strictly for system operations.' }, { status: 400 });
      }

      // Check duplicate accounts
      const existingUser = await User.findOne({ 
        $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }] 
      });
      
      if (existingUser) {
        return NextResponse.json({ error: 'Username signature or Email asset already exists inside the database.' }, { status: 400 });
      }

      // Create new record inside the kayalvista instance directly
      const newUser = await User.create({
        fullName,
        username,
        email,
        contactDetails,
        password,
        role: role || 'NORMAL_USER',
      });

      const sessionToken = btoa(JSON.stringify({ id: newUser._id, role: newUser.role }));

      return NextResponse.json({
        success: true,
        token: sessionToken,
        user: {
          name: newUser.fullName,
          role: newUser.role,
        },
      });
    }

    return NextResponse.json({ error: 'Unsupported action parameter' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Anomaly' }, { status: 500 });
  }
}