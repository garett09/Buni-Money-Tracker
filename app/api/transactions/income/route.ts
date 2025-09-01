import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { redis } from '@/app/lib/redis';

// Helper function to verify JWT token
async function verifyToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

// GET - Fetch user's income transactions
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const transactions = await redis.lrange(`user:${user.userId}:income`, 0, -1);
    return NextResponse.json({ transactions });

  } catch (error) {
    console.error('Error fetching income transactions:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

// POST - Add new income transaction
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const transactionData = await request.json();
    const transaction = {
      id: Date.now(),
      ...transactionData,
      amount: parseFloat(transactionData.amount),
      createdAt: new Date().toISOString()
    };

    // Add to user's income list
    await redis.lpush(`user:${user.userId}:income`, transaction);

    return NextResponse.json({
      message: 'Income transaction added successfully',
      transaction
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding income transaction:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
