import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { jobTrackers, users } from '@/db/schema';
import { eq, and, or, gte, lt } from 'drizzle-orm';
import { sendTelegramReminder } from '@/service/notificationService';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDateH2 = new Date(today);
    targetDateH2.setDate(today.getDate() + 2);
    const startOfTargetH2 = targetDateH2;
    const endOfTargetH2 = new Date(new Date(targetDateH2).setHours(23, 59, 59, 999));

    const targetDateH1 = new Date(today);
    targetDateH1.setDate(today.getDate() + 1);
    const startOfTargetH1 = targetDateH1;
    const endOfTargetH1 = new Date(new Date(targetDateH1).setHours(23, 59, 59, 999));

    const remindersToSend = await db
      .select({ job: jobTrackers, user: users })
      .from(jobTrackers)
      .leftJoin(users, eq(jobTrackers.userId, users.id))
      .where(
        and(
          eq(jobTrackers.is_notification_enabled, true),
          or(
            and(gte(jobTrackers.interview_date, startOfTargetH1), lt(jobTrackers.interview_date, endOfTargetH1)),
            and(gte(jobTrackers.interview_date, startOfTargetH2), lt(jobTrackers.interview_date, endOfTargetH2))
          )
        )
      );

    for (const { job, user } of remindersToSend) {
      if (user?.telegram_chat_id) {
        await sendTelegramReminder(user, job);
      }
    }

    return NextResponse.json({ message: `Berhasil memproses ${remindersToSend.length} pengingat.` });
  } catch (error) {
    console.error('Cron job gagal:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
