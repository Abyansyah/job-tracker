import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { applicationSources } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    const { name, color } = await request.json();
    const updatedSource = await db
      .update(applicationSources)
      .set({ name, color })
      .where(and(eq(applicationSources.id, parseInt((await params).id)), eq(applicationSources.userId, user.id)))
      .returning();
    if (updatedSource.length === 0) {
      return NextResponse.json({ message: 'Source not found or not owned by user' }, { status: 404 });
    }
    return NextResponse.json(updatedSource[0]);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update source' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    const deletedSource = await db
      .delete(applicationSources)
      .where(and(eq(applicationSources.id, parseInt((await params).id)), eq(applicationSources.userId, user.id)))
      .returning();
    if (deletedSource.length === 0) {
      return NextResponse.json({ message: 'Source not found or not owned by user' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Source deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete source' }, { status: 500 });
  }
}
