import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { statuses } from '@/db/schema';
import { eq, or, isNull } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    const data = await db
      .select()
      .from(statuses)
      .where(or(isNull(statuses.userId), eq(statuses.userId, user.id)));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch statuses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const { name, color } = await request.json();
    const newStatus = await db.insert(statuses).values({ name, color, userId: user.id }).returning();
    return NextResponse.json(newStatus[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create status' }, { status: 500 });
  }
}
