import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { applicationSources } from '@/db/schema';
import { eq, or, isNull } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    const data = await db
      .select()
      .from(applicationSources)
      .where(or(isNull(applicationSources.userId), eq(applicationSources.userId, user.id)));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch sources' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const { name, color } = await request.json();
    const newSource = await db.insert(applicationSources).values({ name, color, userId: user.id }).returning();
    return NextResponse.json(newSource[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create source' }, { status: 500 });
  }
}
