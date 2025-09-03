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
    
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const accounts = await DataPersistence.getListData(user.userId, 'accounts');
    
    // Filter only active accounts
    const activeAccounts = accounts.filter(account => account.isActive !== false);

    const response = NextResponse.json({ accounts: activeAccounts });
    
    // Add security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    return response;

  } catch (error) {
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

    // Add account using DataPersistence
    const success = await DataPersistence.addListItem(user.userId, 'accounts', account);

    if (success) {
      const response = NextResponse.json({
        message: 'Account added successfully',
        account
      }, { status: 201 });
      
      // Add security headers
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-XSS-Protection', '1; mode=block');
      
      return response;
    } else {
      return NextResponse.json(
        { message: 'Failed to add account' },
        { status: 500 }
      );
    }

  } catch (error) {
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
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
