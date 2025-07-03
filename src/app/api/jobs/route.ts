import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { jobTrackers, locations, statuses, applicationSources } from '@/db/schema';
import { eq, and, desc, or, ilike } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('searchTerm');
    const locationName = searchParams.get('location');
    const statusName = searchParams.get('status');
    const sourceName = searchParams.get('source');

    const conditions = [eq(jobTrackers.userId, user.id)];

    if (searchTerm) {
      conditions.push(or(ilike(jobTrackers.company_name, `%${searchTerm}%`), ilike(jobTrackers.position_applied, `%${searchTerm}%`))!);
    }
    if (locationName) {
      conditions.push(eq(locations.name, locationName));
    }
    if (statusName) {
      conditions.push(eq(statuses.name, statusName));
    }
    if (sourceName) {
      conditions.push(eq(applicationSources.name, sourceName));
    }
    const data = await db
      .select({
        id: jobTrackers.id,
        company: jobTrackers.company_name,
        position: jobTrackers.position_applied,
        url: jobTrackers.url,
        applicationDate: jobTrackers.application_date,
        interviewDate: jobTrackers.interview_date,
        notes: jobTrackers.notes,
        location: locations.name,
        status: statuses.name,
        source: applicationSources.name,
        statusColor: statuses.color,
        locationId: jobTrackers.locationId,
        statusId: jobTrackers.statusId,
        sourceId: jobTrackers.sourceId,
        is_notification_enabled: jobTrackers.is_notification_enabled,
      })
      .from(jobTrackers)
      .leftJoin(locations, eq(jobTrackers.locationId, locations.id))
      .leftJoin(statuses, eq(jobTrackers.statusId, statuses.id))
      .leftJoin(applicationSources, eq(jobTrackers.sourceId, applicationSources.id))
      .where(and(...conditions))
      .orderBy(desc(jobTrackers.application_date));

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    return NextResponse.json({ message: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const body = await request.json();

    // Sanitize and prepare data for insertion
    const valuesToInsert = {
      ...body,
      application_date: new Date(body.application_date), // Convert string to Date
      interview_date: body.interview_date ? new Date(body.interview_date) : null, // Handle optional date
      locationId: body.locationId || null,
      statusId: body.statusId || null,
      sourceId: body.sourceId || null,
      userId: user.id,
    };

    const newJob = await db
      .insert(jobTrackers)
      .values(valuesToInsert) // Use sanitized values
      .returning();

    return NextResponse.json(newJob[0], { status: 201 });
  } catch (error) {
    console.error('Failed to create job:', error);
    // Return the actual error in the response for better debugging
    return NextResponse.json({ message: `Failed to create job: ${error}` }, { status: 500 });
  }
}
