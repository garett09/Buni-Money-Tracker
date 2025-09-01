import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { DataPersistence } from '@/app/lib/dataPersistence';

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
    
    // For development, if no user is authenticated, return sample accounts
    if (!user) {
      console.log('No valid token found in request - returning sample accounts for development');
      const sampleAccounts = [
        {
          id: 1,
          name: 'BPI Savings',
          accountType: 'savings',
          bankId: 'bpi',
          accountNumber: '****1234',
          currentBalance: 50000,
          description: 'Main savings account',
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'GCash Wallet',
          accountType: 'digital-wallet',
          digitalWalletId: 'gcash',
          accountNumber: '****5678',
          currentBalance: 5000,
          description: 'Daily expenses wallet',
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ];
      return NextResponse.json({ accounts: sampleAccounts });
    }

    console.log('User authenticated:', user.userId);
    const accounts = await DataPersistence.getListData(user.userId, 'accounts');
    
    // Filter only active accounts
    const activeAccounts = accounts.filter(account => account.isActive !== false);

    console.log(`Found ${activeAccounts.length} active accounts for user ${user.userId}`);
    return NextResponse.json({ accounts: activeAccounts });

  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json(
      { message: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

// POST - Add new account
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    
    // For development, if no user is authenticated, return success but don't save to database
    if (!user) {
      console.log('No valid token found in request - returning success for development');
      const accountData = await request.json();
      const account = {
        id: Date.now(),
        ...accountData,
        currentBalance: parseFloat(accountData.currentBalance) || 0,
        createdAt: new Date().toISOString()
      };
      
      return NextResponse.json({
        message: 'Account added successfully (development mode)',
        account
      }, { status: 201 });
    }

    const accountData = await request.json();
    const account = {
      id: Date.now(),
      ...accountData,
      currentBalance: parseFloat(accountData.currentBalance) || 0,
      createdAt: new Date().toISOString()
    };

    // Add account using DataPersistence
    const success = await DataPersistence.addListItem(user.userId, 'accounts', account);

    if (success) {
      return NextResponse.json({
        message: 'Account added successfully',
        account
      }, { status: 201 });
    } else {
      return NextResponse.json(
        { message: 'Failed to add account' },
        { status: 500 }
      );
    }

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
    
    // Update account using DataPersistence
    const success = await DataPersistence.updateListItem(user.userId, 'accounts', accountId, updates);

    if (success) {
      // Get the updated account
      const accounts = await DataPersistence.getListData(user.userId, 'accounts');
      const updatedAccount = accounts.find(account => account.id === accountId);

      return NextResponse.json({
        message: 'Account updated successfully',
        account: updatedAccount
      });
    } else {
      return NextResponse.json({ message: 'Account not found' }, { status: 404 });
    }

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
    
    // Delete account using DataPersistence
    const success = await DataPersistence.deleteListItem(user.userId, 'accounts', accountId);

    if (success) {
      return NextResponse.json({
        message: 'Account deleted successfully'
      });
    } else {
      return NextResponse.json({ message: 'Account not found' }, { status: 404 });
    }

  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
