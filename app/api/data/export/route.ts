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

// GET - Export user data
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Export all user data
    const exportData = await DataPersistence.exportUserData(user.userId);
    
    if (!exportData) {
      return NextResponse.json(
        { message: 'Failed to export user data' },
        { status: 500 }
      );
    }

    // Set headers for file download
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Content-Disposition', `attachment; filename="buni-money-tracker-backup-${user.userId}-${Date.now()}.json"`);

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers
    });

  } catch (error) {
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
