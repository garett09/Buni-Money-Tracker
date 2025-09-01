import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { redis } from '@/app/lib/redis';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Input validation
    if (!email || !password) {
      return NextResponse.json({ 
        message: 'Email and password are required' 
      }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        message: 'Please provide a valid email address' 
      }, { status: 400 });
    }

    // Find user by email (case-insensitive)
    const userId = await redis.get(`user:email:${email.toLowerCase()}`);
    if (!userId) {
      return NextResponse.json({ 
        message: 'Invalid email or password' 
      }, { status: 401 });
    }

    // Get user data
    const user = await redis.hgetall(`user:${userId}`);
    if (!user || Object.keys(user).length === 0) {
      return NextResponse.json({ 
        message: 'Invalid email or password' 
      }, { status: 401 });
    }

    // Check if user account is active
    if (user.isActive === 'false') {
      return NextResponse.json({ 
        message: 'Account is deactivated. Please contact support.' 
      }, { status: 403 });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ 
        message: 'Invalid email or password' 
      }, { status: 401 });
    }

    // Update last login time
    await redis.hset(`user:${userId}`, 'lastLogin', new Date().toISOString());

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    console.log(`User logged in: ${email} (ID: ${userId})`);

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        message: 'Login failed. Please try again.',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      { status: 500 }
    );
  }
}
