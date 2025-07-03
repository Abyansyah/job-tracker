import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { jobTrackers, statuses } from '@/db/schema';
import { eq, sql, and } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    const userId = user.id;

    // Menghitung total lamaran
    const totalApplicationsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(jobTrackers)
      .where(eq(jobTrackers.userId, userId));
    const totalApplications = totalApplicationsResult[0].count;

    // Menghitung statistik berdasarkan status
    const statusStatsResult = await db
      .select({
        statusName: statuses.name,
        count: sql<number>`count(*)`,
      })
      .from(jobTrackers)
      .leftJoin(statuses, eq(jobTrackers.statusId, statuses.id))
      .where(and(eq(jobTrackers.userId, userId), sql`LOWER("statuses"."name") IN ('interview', 'offered', 'rejected')`))
      .groupBy(statuses.name);

    const statusStats = statusStatsResult.reduce((acc, row) => {
      if (row.statusName) {
        acc[row.statusName.toLowerCase()] = row.count;
      }
      return acc;
    }, {} as Record<string, number>);

    // Statistik untuk chart
    const monthlyApplications = await db
      .select({
        month: sql<string>`TO_CHAR("application_date", 'Mon')`,
        // Tambahkan kolom numerik untuk pengurutan
        month_numeric: sql<string>`TO_CHAR("application_date", 'MM')`,
        applications: sql<number>`count(*)`,
      })
      .from(jobTrackers)
      .where(eq(jobTrackers.userId, userId))
      // Kelompokkan juga berdasarkan kolom numerik
      .groupBy(sql`TO_CHAR("application_date", 'Mon')`, sql`TO_CHAR("application_date", 'MM')`)
      // Urutkan berdasarkan kolom numerik
      .orderBy(sql`TO_CHAR("application_date", 'MM')`);

    const statusBreakdown = await db
      .select({
        name: statuses.name,
        value: sql<number>`count(*)`,
        color: statuses.color,
      })
      .from(jobTrackers)
      .leftJoin(statuses, eq(jobTrackers.statusId, statuses.id))
      .where(eq(jobTrackers.userId, userId))
      .groupBy(statuses.name, statuses.color);

    // Lamaran terbaru
    const recentApplications = await db
      .select({
        company: jobTrackers.company_name,
        position: jobTrackers.position_applied,
        status: statuses.name,
        date: jobTrackers.application_date,
        statusColor: statuses.color,
      })
      .from(jobTrackers)
      .leftJoin(statuses, eq(jobTrackers.statusId, statuses.id))
      .where(eq(jobTrackers.userId, userId))
      .orderBy(sql`${jobTrackers.application_date} DESC`)
      .limit(4);

    return NextResponse.json({
      totalApplications,
      interviews: statusStats['interview'] || 0,
      offers: statusStats['offered'] || 0,
      rejections: statusStats['rejected'] || 0,
      monthlyApplications,
      statusBreakdown,
      recentApplications,
    });
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return NextResponse.json({ message: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
