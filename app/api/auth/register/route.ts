import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { redis } from '@/app/lib/redis';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Check if user already exists
    const existingUser = await redis.get(`user:email:${email}`);
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = uuidv4();
    const user = {
      id: userId,
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    // Store user by ID
    await redis.hset(`user:${userId}`, user);
    // Store user by email for login lookup
    await redis.set(`user:email:${email}`, userId);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'User created successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
