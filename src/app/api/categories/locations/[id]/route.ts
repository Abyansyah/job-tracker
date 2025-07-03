import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { locations } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    const { name, color } = await request.json();
    const updatedLocation = await db
      .update(locations)
      .set({ name, color })
      .where(and(eq(locations.id, parseInt((await params).id)), eq(locations.userId, user.id)))
      .returning();
    if (updatedLocation.length === 0) {
      return NextResponse.json({ message: 'Location not found or not owned by user' }, { status: 404 });
    }
    return NextResponse.json(updatedLocation[0]);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update location' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    const deletedLocation = await db
      .delete(locations)
      .where(and(eq(locations.id, parseInt((await params).id)), eq(locations.userId, user.id)))
      .returning();
    if (deletedLocation.length === 0) {
      return NextResponse.json({ message: 'Location not found or not owned by user' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Location deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete location' }, { status: 500 });
  }
}
