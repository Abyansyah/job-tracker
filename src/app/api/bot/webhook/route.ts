import { NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const token = process.env.TELEGRAM_BOT_TOKEN!;
const bot = new TelegramBot(token);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body.message;

    if (message?.text?.startsWith('/start ')) {
      const chatId = message.chat.id;
      const connectionToken = message.text.split(' ')[1];

      try {
        const decoded = jwt.verify(connectionToken, process.env.JWT_SECRET!) as { userId: number };
        await db
          .update(users)
          .set({ telegram_chat_id: String(chatId) })
          .where(eq(users.id, decoded.userId));
        await bot.sendMessage(chatId, `✅ Berhasil! Akun JobTracker Anda telah terhubung. Anda akan menerima notifikasi pengingat melalui bot ini.`);
      } catch (e) {
        await bot.sendMessage(chatId, `❌ Gagal! Token koneksi tidak valid atau sudah kedaluwarsa. Silakan coba lagi dari aplikasi.`);
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
