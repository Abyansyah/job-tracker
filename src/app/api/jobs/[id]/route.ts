import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { jobTrackers } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();
    const jobId = parseInt((await params).id);

    // Sanitize and prepare data for update
    const valuesToUpdate = {
      ...body,
      application_date: new Date(body.application_date), // Convert string to Date
      interview_date: body.interview_date ? new Date(body.interview_date) : null, // Handle optional date
      locationId: body.locationId || null,
      statusId: body.statusId || null,
      sourceId: body.sourceId || null,
    };

    const updatedJob = await db
      .update(jobTrackers)
      .set(valuesToUpdate) // Use sanitized values
      .where(and(eq(jobTrackers.id, jobId), eq(jobTrackers.userId, user.id)))
      .returning();

    if (updatedJob.length === 0) {
      return NextResponse.json({ message: 'Job not found or not owned by user' }, { status: 404 });
    }

    return NextResponse.json(updatedJob[0]);
  } catch (error) {
    console.error(`Failed to update job ${(await params).id}:`, error);
    return NextResponse.json({ message: `Failed to update job: ${error}` }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    const jobId = parseInt((await params).id);

    const deletedJob = await db
      .delete(jobTrackers)
      .where(and(eq(jobTrackers.id, jobId), eq(jobTrackers.userId, user.id)))
      .returning();

    if (deletedJob.length === 0) {
      return NextResponse.json({ message: 'Job not found or not owned by user' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error(`Failed to delete job ${(await params).id}:`, error);
    return NextResponse.json({ message: 'Failed to delete job' }, { status: 500 });
  }
}
