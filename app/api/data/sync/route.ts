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

// POST - Sync data across devices
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { dataType, lastSyncTime } = await request.json();
    
    if (!dataType || typeof lastSyncTime !== 'number') {
      return NextResponse.json(
        { message: 'Invalid sync parameters' },
        { status: 400 }
      );
    }

    // Sync data
    const syncResult = await DataPersistence.syncData(user.userId, dataType, lastSyncTime);
    
    if (syncResult) {
      return NextResponse.json({
        message: 'Data synced successfully',
        data: syncResult.data,
        timestamp: syncResult.timestamp,
        hasUpdates: true
      });
    } else {
      return NextResponse.json({
        message: 'No updates available',
        hasUpdates: false
      });
    }

  } catch (error) {
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
