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

// GET - Get user profile
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get user data from Redis
    const userData = await redis.hgetall(`user:${user.userId}`);
    if (!userData || Object.keys(userData).length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Return user data without password
    const { password, ...safeUserData } = userData;
    
    return NextResponse.json({
      user: safeUserData
    });

  } catch (error) {
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    const allowedFields = ['name', 'email'];
    const filteredUpdates: any = {};

    // Only allow certain fields to be updated
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }

    // If email is being updated, check for duplicates
    if (filteredUpdates.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(filteredUpdates.email)) {
        return NextResponse.json({ 
          message: 'Please provide a valid email address' 
        }, { status: 400 });
      }

      const normalizedEmail = filteredUpdates.email.toLowerCase().trim();
      const existingUserId = await redis.get(`user:email:${normalizedEmail}`);
      
      if (existingUserId && existingUserId !== user.userId) {
        return NextResponse.json({ 
          message: 'An account with this email already exists' 
        }, { status: 409 });
      }

      // Update email mapping if email changed
      const currentUser = await redis.hgetall(`user:${user.userId}`);
      if (currentUser.email !== normalizedEmail) {
        // Remove old email mapping
        await redis.del(`user:email:${currentUser.email}`);
        // Add new email mapping
        await redis.set(`user:email:${normalizedEmail}`, user.userId);
        filteredUpdates.email = normalizedEmail;
      }
    }

    // Update user data
    if (Object.keys(filteredUpdates).length > 0) {
      await redis.hset(`user:${user.userId}`, filteredUpdates);
    }

    return NextResponse.json({
      message: 'Profile updated successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user account
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get user data to clean up email mapping
    const userData = await redis.hgetall(`user:${user.userId}`);
    
    // Delete user data
    await redis.del(`user:${user.userId}`);
    
    // Delete email mapping
    if (userData.email) {
      await redis.del(`user:email:${userData.email}`);
    }
    
    // Remove from users list
    await redis.srem('users:all', user.userId);
    
    // Delete user's transactions and goals
    await redis.del(`user:${user.userId}:income`);
    await redis.del(`user:${user.userId}:expenses`);
    await redis.del(`user:${user.userId}:savings-goals`);

    return NextResponse.json({
      message: 'Account deleted successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
