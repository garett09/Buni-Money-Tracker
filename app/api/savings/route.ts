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

// GET - Fetch user's savings goals
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const goals = await redis.lrange(`user:${user.userId}:savings-goals`, 0, -1);
    return NextResponse.json({ goals });

  } catch (error) {
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

// POST - Add new savings goal
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const goalData = await request.json();
    const goal = {
      id: Date.now(),
      ...goalData,
      targetAmount: parseFloat(goalData.targetAmount),
      currentAmount: parseFloat(goalData.currentAmount || 0),
      createdAt: new Date().toISOString(),
      isActive: true
    };

    // Add to user's savings goals list
    await redis.lpush(`user:${user.userId}:savings-goals`, goal);

    return NextResponse.json({
      message: 'Savings goal added successfully',
      goal
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

// PUT - Update savings goal
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { goalId, updates } = await request.json();
    
    // Get all goals
    const goals = await redis.lrange(`user:${user.userId}:savings-goals`, 0, -1);
    
    // Find and update the goal
    const updatedGoals = goals.map((goal: any) => {
      if (goal.id === goalId) {
        return { ...goal, ...updates };
      }
      return goal;
    });

    // Replace the entire list
    await redis.del(`user:${user.userId}:savings-goals`);
    if (updatedGoals.length > 0) {
      await redis.lpush(`user:${user.userId}:savings-goals`, ...updatedGoals);
    }

    return NextResponse.json({
      message: 'Savings goal updated successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete savings goal
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { goalId } = await request.json();
    
    // Get all goals
    const goals = await redis.lrange(`user:${user.userId}:savings-goals`, 0, -1);
    
    // Filter out the goal to delete
    const updatedGoals = goals.filter((goal: any) => goal.id !== goalId);

    // Replace the entire list
    await redis.del(`user:${user.userId}:savings-goals`);
    if (updatedGoals.length > 0) {
      await redis.lpush(`user:${user.userId}:savings-goals`, ...updatedGoals);
    }

    return NextResponse.json({
      message: 'Savings goal deleted successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
