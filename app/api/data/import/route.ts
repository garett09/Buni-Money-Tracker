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

export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { importData } = await request.json();
    
    if (!importData) {
      return NextResponse.json({ error: 'Import data is required' }, { status: 400 });
    }

    // Validate import data structure
    if (!importData.userId || !importData.data || !importData.version) {
      return NextResponse.json({ error: 'Invalid import data format' }, { status: 400 });
    }

    // Import the data
    const success = await DataPersistence.importUserData(user.userId, importData);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to import data' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Data import completed successfully',
      importedDataTypes: Object.keys(importData.data || {})
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to import data' }, { status: 500 });
  }
}
