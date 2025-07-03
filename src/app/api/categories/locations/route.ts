import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { locations } from '@/db/schema';
import { eq, or, isNull } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    const data = await db
      .select()
      .from(locations)
      .where(or(isNull(locations.userId), eq(locations.userId, user.id)));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch locations' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const { name, color } = await request.json();
    const newLocation = await db.insert(locations).values({ name, color, userId: user.id }).returning();
    return NextResponse.json(newLocation[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create location' }, { status: 500 });
  }
}