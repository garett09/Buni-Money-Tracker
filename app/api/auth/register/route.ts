import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { redis } from '@/app/lib/redis';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Input validation
    if (!name || !email || !password) {
      return NextResponse.json({ 
        message: 'Name, email, and password are required' 
      }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        message: 'Please provide a valid email address' 
      }, { status: 400 });
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json({ 
        message: 'Password must be at least 6 characters long' 
      }, { status: 400 });
    }

    // Check if user already exists (case-insensitive)
    const existingUserId = await redis.get(`user:email:${email.toLowerCase()}`);
    if (existingUserId) {
      return NextResponse.json({ 
        message: 'An account with this email already exists' 
      }, { status: 409 }); // 409 Conflict
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds

    // Create user
    const userId = uuidv4();
    const user = {
      id: userId,
      name: name.trim(),
      email: email.toLowerCase().trim(), // Store email in lowercase
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      isActive: true,
      lastLogin: null
    };

    // Store user data in Redis
    await redis.hset(`user:${userId}`, user);
    
    // Store email-to-userId mapping for login lookup
    await redis.set(`user:email:${email.toLowerCase()}`, userId);
    
    // Add user to users list for admin purposes (optional)
    await redis.sadd('users:all', userId);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    console.log(`New user registered: ${email} (ID: ${userId})`);

    return NextResponse.json({
      message: 'Account created successfully',
      token,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        createdAt: user.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        message: 'Registration failed. Please try again.',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      { status: 500 }
    );
  }
}
