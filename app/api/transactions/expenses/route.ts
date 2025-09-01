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

// GET - Fetch user's expense transactions
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const transactions = await redis.lrange(`user:${user.userId}:expenses`, 0, -1);
    return NextResponse.json({ transactions });

  } catch (error) {
    console.error('Error fetching expense transactions:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

// POST - Add new expense transaction
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

    // Add to user's expense list
    await redis.lpush(`user:${user.userId}:expenses`, transaction);

    return NextResponse.json({
      message: 'Expense transaction added successfully',
      transaction
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding expense transaction:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

// PUT - Update existing expense transaction
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { transactionId, updates } = await request.json();
    
    // Get all transactions
    const transactions = await redis.lrange(`user:${user.userId}:expenses`, 0, -1);
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
    await redis.lset(`user:${user.userId}:expenses`, transactionIndex, updatedTransaction);

    return NextResponse.json({
      message: 'Expense transaction updated successfully',
      transaction: updatedTransaction
    });

  } catch (error) {
    console.error('Error updating expense transaction:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete expense transaction
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { transactionId } = await request.json();
    
    // Get all transactions
    const transactions = await redis.lrange(`user:${user.userId}:expenses`, 0, -1);
    const transactionIndex = transactions.findIndex((t: any) => t.id === transactionId);
    
    if (transactionIndex === -1) {
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    }

    // Remove the transaction from the list
    const deletedTransaction = JSON.parse(transactions[transactionIndex]);
    await redis.lrem(`user:${user.userId}:expenses`, 1, transactions[transactionIndex]);

    return NextResponse.json({
      message: 'Expense transaction deleted successfully',
      transaction: deletedTransaction
    });

  } catch (error) {
    console.error('Error deleting expense transaction:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
