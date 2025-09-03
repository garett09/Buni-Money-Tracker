import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { redis } from '@/app/lib/redis';
import { rateLimiters, getClientIP } from '@/app/lib/rateLimit';

export async function POST(request: NextRequest) {
  // Apply rate limiting for authentication
  const clientIP = getClientIP(request);
  const rateLimitResult = rateLimiters.auth.isAllowed(clientIP);
  
  if (!rateLimitResult.allowed) {
    return NextResponse.json({ 
      message: 'Too many login attempts. Please try again later.',
      retryAfter: Math.ceil(rateLimiters.auth.config.windowMs / 1000)
    }, { 
      status: 429,
      headers: {
        'X-RateLimit-Limit': rateLimiters.auth.config.max.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toUTCString(),
        'Retry-After': Math.ceil(rateLimiters.auth.config.windowMs / 1000).toString()
      }
    });
  }

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
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not configured');
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

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
    return NextResponse.json(
      { 
        message: 'Login failed. Please try again.',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      { status: 500 }
    );
  }
}
