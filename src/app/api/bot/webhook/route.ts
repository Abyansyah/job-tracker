import { NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('FATAL: TELEGRAM_BOT_TOKEN tidak ditemukan.');
}
const bot = new TelegramBot(token!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body.message;

    if (!message || !message.chat?.id) {
      return NextResponse.json({ status: 'ignored' });
    }

    const chatId = message.chat.id;
    const text = message.text || '';

    // Pisahkan perintah dan argumen
    const parts = text.split(' ');
    const command = parts[0];
    const connectionToken = parts[1]; // Bisa undefined jika tidak ada

    if (command === '/start') {
      // Skenario 1: Ada token koneksi
      if (connectionToken) {
        try {
          // Verifikasi token
          const decoded = jwt.verify(connectionToken, process.env.JWT_SECRET!) as { userId: number };

          // Update database
          await db
            .update(users)
            .set({ telegram_chat_id: String(chatId) })
            .where(eq(users.id, decoded.userId));

          // Kirim pesan sukses
          await bot.sendMessage(chatId, `✅ Berhasil! Akun JobTracker Anda telah terhubung. Anda akan menerima notifikasi pengingat melalui bot ini.`);
        } catch (e) {
          // Token tidak valid atau kedaluwarsa
          await bot.sendMessage(chatId, `❌ Gagal! Tautan koneksi tidak valid atau sudah kedaluwarsa. Silakan buat tautan baru dari dalam aplikasi JobTracker Anda.`);
        }
      }
      // Skenario 2: Tidak ada token koneksi
      else {
        await bot.sendMessage(chatId, `👋 Halo! Untuk bisa menerima notifikasi, silakan buka aplikasi JobTracker Anda dan klik tombol "Hubungkan ke Telegram" dari halaman profil.`);
      }
    } else {
      await bot.sendMessage(chatId, `❓ Perintah tidak dikenali. Silakan gunakan /start untuk memulai.`);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('FATAL ERROR di webhook:', error.message);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
