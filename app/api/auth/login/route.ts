import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { redis } from '@/app/lib/redis';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Find user
    const userId = await redis.get(`user:email:${email}`);
    if (!userId) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    const user = await redis.hgetall(`user:${userId}`);
    if (!user || Object.keys(user).length === 0) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
