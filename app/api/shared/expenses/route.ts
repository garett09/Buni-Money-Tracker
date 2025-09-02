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

// GET - Fetch shared expenses between two users
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get user's sharing settings
    const userData = await redis.hgetall(`user:${user.userId}`);
    const sharingEnabled = userData.sharingEnabled === 'true';
    const partnerUserId = userData.partnerUserId;

    if (!sharingEnabled || !partnerUserId) {
      return NextResponse.json({ 
        message: 'Sharing not enabled or no partner set',
        sharedExpenses: [],
        partnerExpenses: []
      });
    }

    // Get both users' expenses
    const userExpenses = await redis.lrange(`user:${user.userId}:expenses`, 0, -1);
    const partnerExpenses = await redis.lrange(`user:${partnerUserId}:expenses`, 0, -1);

    // Parse expenses and add user info
    const parsedUserExpenses = userExpenses.map((expense: string) => ({
      ...JSON.parse(expense),
      userId: user.userId,
      userName: userData.name || 'You',
      userEmail: userData.email
    }));

    const parsedPartnerExpenses = partnerExpenses.map((expense: string) => ({
      ...JSON.parse(expense),
      userId: partnerUserId,
      userName: userData.partnerName || 'Partner',
      userEmail: userData.partnerEmail
    }));

    // Combine and sort by date (newest first)
    const allSharedExpenses = [...parsedUserExpenses, ...parsedPartnerExpenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      sharedExpenses: allSharedExpenses,
      userExpenses: parsedUserExpenses,
      partnerExpenses: parsedPartnerExpenses,
      sharingEnabled: true,
      partnerInfo: {
        userId: partnerUserId,
        name: userData.partnerName || 'Partner',
        email: userData.partnerEmail
      }
    });

  } catch (error) {
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

// POST - Enable/disable sharing and set partner
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { action, partnerEmail, partnerName } = await request.json();

    if (action === 'enable') {
      if (!partnerEmail) {
        return NextResponse.json({ message: 'Partner email is required' }, { status: 400 });
      }

      // Find partner user by email
      const allUsers = await redis.smembers('users');
      let partnerUserId = null;
      let partnerUserData = null;

      for (const userId of allUsers) {
        const userData = await redis.hgetall(`user:${userId}`);
        if (userData.email && userData.email.toLowerCase() === partnerEmail.toLowerCase()) {
          partnerUserId = userId;
          partnerUserData = userData;
          break;
        }
      }

      if (!partnerUserId) {
        return NextResponse.json({ message: 'Partner not found' }, { status: 404 });
      }

      if (partnerUserId === user.userId) {
        return NextResponse.json({ message: 'Cannot share with yourself' }, { status: 400 });
      }

      // Update current user's sharing settings
      await redis.hset(`user:${user.userId}`, {
        sharingEnabled: 'true',
        partnerUserId: partnerUserId,
        partnerName: partnerName || partnerUserData.name,
        partnerEmail: partnerEmail
      });

      // Update partner's sharing settings (reciprocal sharing)
      await redis.hset(`user:${partnerUserId}`, {
        sharingEnabled: 'true',
        partnerUserId: user.userId,
        partnerName: user.name,
        partnerEmail: user.email
      });

      return NextResponse.json({
        message: 'Sharing enabled successfully',
        partnerInfo: {
          userId: partnerUserId,
          name: partnerName || partnerUserData.name,
          email: partnerEmail
        }
      });

    } else if (action === 'disable') {
      // Get current partner info
      const userData = await redis.hgetall(`user:${user.userId}`);
      const partnerUserId = userData.partnerUserId;

      // Disable sharing for current user
      await redis.hdel(`user:${user.userId}`, 'sharingEnabled', 'partnerUserId', 'partnerName', 'partnerEmail');

      // Disable sharing for partner if exists
      if (partnerUserId) {
        await redis.hdel(`user:${partnerUserId}`, 'sharingEnabled', 'partnerUserId', 'partnerName', 'partnerEmail');
      }

      return NextResponse.json({ message: 'Sharing disabled successfully' });

    } else {
      return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
