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
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not configured');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
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
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

// PUT - Update existing income transaction
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { transactionId, updates } = await request.json();
    
    // Get all transactions
    const transactions = await redis.lrange(`user:${user.userId}:income`, 0, -1);
    const transactionIndex = transactions.findIndex((t: any) => t.id === transactionId);
    
    if (transactionIndex === -1) {
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }

    // Update the transaction
    const updatedTransaction = {
      ...JSON.parse(transactions[transactionIndex]),
      ...updates,
      amount: updates.amount ? parseFloat(updates.amount) : JSON.parse(transactions[transactionIndex]).amount,
      updatedAt: new Date().toISOString()
    };

    // Replace the transaction in the list
    await redis.lset(`user:${user.userId}:income`, transactionIndex, updatedTransaction);

    return NextResponse.json({
      message: 'Income transaction updated successfully',
      transaction: updatedTransaction
    });

  } catch (error) {
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete income transaction
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { transactionId } = await request.json();
    
    // Get all transactions
    const transactions = await redis.lrange(`user:${user.userId}:income`, 0, -1);
    const transactionIndex = transactions.findIndex((t: any) => t.id === transactionId);
    
    if (transactionIndex === -1) {
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }

    // Remove the transaction from the list
    const deletedTransaction = JSON.parse(transactions[transactionIndex]);
    await redis.lrem(`user:${user.userId}:income`, 1, transactions[transactionIndex]);

    return NextResponse.json({
      message: 'Income transaction deleted successfully',
      transaction: deletedTransaction
    });

  } catch (error) {
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
    }
}
