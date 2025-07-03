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

    const reminderDateH1 = new Date(today);
    reminderDateH1.setDate(today.getDate() + 1);
    const startOfH1 = new Date(reminderDateH1);
    const endOfH1 = new Date(new Date(reminderDateH1).setHours(23, 59, 59, 999));

    const reminderDateH2 = new Date(today);
    reminderDateH2.setDate(today.getDate() + 2);
    const startOfH2 = new Date(reminderDateH2);
    const endOfH2 = new Date(new Date(reminderDateH2).setHours(23, 59, 59, 999));

    const remindersToSend = await db
      .select({ job: jobTrackers, user: users })
      .from(jobTrackers)
      .leftJoin(users, eq(jobTrackers.userId, users.id))
      .where(
        and(
          eq(jobTrackers.is_notification_enabled, true),
          or(and(gte(jobTrackers.interview_date, startOfH1), lt(jobTrackers.interview_date, endOfH1)), and(gte(jobTrackers.interview_date, startOfH2), lt(jobTrackers.interview_date, endOfH2)))
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
