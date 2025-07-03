import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { statuses } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    const { name, color } = await request.json();
    const updatedStatus = await db
      .update(statuses)
      .set({ name, color })
      .where(and(eq(statuses.id, parseInt((await params).id)), eq(statuses.userId, user.id)))
      .returning();
    if (updatedStatus.length === 0) {
      return NextResponse.json({ message: 'Status not found or not owned by user' }, { status: 404 });
    }
    return NextResponse.json(updatedStatus[0]);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update status' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    const deletedStatus = await db
      .delete(statuses)
      .where(and(eq(statuses.id, parseInt((await params).id)), eq(statuses.userId, user.id)))
      .returning();
    if (deletedStatus.length === 0) {
      return NextResponse.json({ message: 'Status not found or not owned by user' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Status deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete status' }, { status: 500 });
  }
}
