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

// GET - Fetch user's accounts
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const accounts = await redis.lrange(`user:${user.userId}:accounts`, 0, -1);
    const parsedAccounts = accounts.map((account: string) => JSON.parse(account));

    return NextResponse.json({ accounts: parsedAccounts });

  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

// POST - Add new account
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const accountData = await request.json();
    const account = {
      id: Date.now(),
      ...accountData,
      currentBalance: parseFloat(accountData.currentBalance) || 0,
      createdAt: new Date().toISOString()
    };

    // Add to user's accounts list
    await redis.lpush(`user:${user.userId}:accounts`, account);

    return NextResponse.json({
      message: 'Account added successfully',
      account
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding account:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

// PUT - Update existing account
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { accountId, updates } = await request.json();
    
    // Get all accounts
    const accounts = await redis.lrange(`user:${user.userId}:accounts`, 0, -1);
    const accountIndex = accounts.findIndex((a: any) => a.id === accountId);
    
    if (accountIndex === -1) {
      return NextResponse.json({ message: 'Account not found' }, { status: 404 });
    }

    // Update the account
    const updatedAccount = {
      ...JSON.parse(accounts[accountIndex]),
      ...updates,
      currentBalance: updates.currentBalance ? parseFloat(updates.currentBalance) : JSON.parse(accounts[accountIndex]).currentBalance,
      updatedAt: new Date().toISOString()
    };

    // Replace the account in the list
    await redis.lset(`user:${user.userId}:accounts`, accountIndex, updatedAccount);

    return NextResponse.json({
      message: 'Account updated successfully',
      account: updatedAccount
    });

  } catch (error) {
    console.error('Error updating account:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete account
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { accountId } = await request.json();
    
    // Get all accounts
    const accounts = await redis.lrange(`user:${user.userId}:accounts`, 0, -1);
    const accountIndex = accounts.findIndex((a: any) => a.id === accountId);
    
    if (accountIndex === -1) {
      return NextResponse.json({ message: 'Account not found' }, { status: 404 });
    }

    // Remove the account from the list
    const deletedAccount = JSON.parse(accounts[accountIndex]);
    await redis.lrem(`user:${user.userId}:accounts`, 1, accounts[accountIndex]);

    return NextResponse.json({
      message: 'Account deleted successfully',
      account: deletedAccount
    });

  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
