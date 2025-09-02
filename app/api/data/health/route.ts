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

// GET - Check data health
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ 
        message: 'Unauthorized - Please log in to access this resource',
        error: 'AUTH_REQUIRED'
      }, { status: 401 });
    }

    // Perform health check
    const healthStatus = await DataPersistence.healthCheck(user.userId);
    
    return NextResponse.json({
      ...healthStatus,
      timestamp: Date.now(),
      userId: user.userId
    });

  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { 
        message: 'Server error during health check',
        error: 'HEALTH_CHECK_FAILED'
      },
      { status: 500 }
    );
  }
}
