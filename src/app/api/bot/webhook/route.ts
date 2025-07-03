import { NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('FATAL: TELEGRAM_BOT_TOKEN tidak ditemukan.');
}
const bot = new TelegramBot(token!);

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body.message;

    if (!message || !message.chat?.id || !message.text) {
      return NextResponse.json({ status: 'ignored', message: 'Invalid message format.' });
    }

    const chatId = message.chat.id;
    const text = message.text;

    if (text === '/start') {
      await bot.sendMessage(chatId, `👋 Selamat datang di Asisten KarirKu!\n\nUntuk bisa menerima notifikasi pengingat wawancara, silakan kirim alamat email yang terdaftar di akun JobTracker Anda.`);
    }

    else if (isValidEmail(text)) {
      const email = text.toLowerCase();

      const foundUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);

      if (foundUsers.length > 0) {
        const user = foundUsers[0];
        await db
          .update(users)
          .set({ telegram_chat_id: String(chatId) })
          .where(eq(users.id, user.id));
        await bot.sendMessage(chatId, `✅ Berhasil! Akun Anda (${user.email}) telah terhubung. Anda siap menerima pengingat wawancara.`);
      } else {
        await bot.sendMessage(chatId, `❌ Maaf, email ${email} tidak ditemukan di sistem kami. Pastikan Anda memasukkan email yang benar.`);
      }
    }
    else {
      await bot.sendMessage(chatId, `Maaf, saya tidak mengerti. Untuk menghubungkan akun, silakan kirim alamat email Anda.`);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('FATAL ERROR di webhook:', error.message);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
