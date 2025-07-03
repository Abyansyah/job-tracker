import { NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

// Inisialisasi bot di luar handler untuk efisiensi
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('FATAL: TELEGRAM_BOT_TOKEN tidak ditemukan di environment variables.');
}
const bot = new TelegramBot(token!);

export async function POST(request: Request) {
  console.log('Webhook dipanggil...'); // LOG 1: Cek apakah fungsi dimulai

  try {
    const body = await request.json();
    const message = body.message;

    if (!message || !message.chat?.id) {
      console.warn('Pesan atau chat.id tidak valid, request diabaikan.');
      return NextResponse.json({ status: 'ignored' });
    }

    const chatId = message.chat.id;
    console.log(`Menerima pesan dari chat_id: ${chatId}`); // LOG 2: Cek chat_id

    // Handle perintah /start dengan token
    if (message.text?.startsWith('/start')) {
      const connectionToken = message.text.split(' ')[1];
      console.log(`Mendeteksi perintah /start dengan token: ${connectionToken}`); // LOG 3

      try {
        console.log('Mencoba memverifikasi JWT...');
        const decoded = jwt.verify(connectionToken, process.env.JWT_SECRET!) as { userId: number };
        console.log(`JWT berhasil diverifikasi untuk userId: ${decoded.userId}`); // LOG 4

        console.log(`Mencoba mengupdate database untuk userId: ${decoded.userId}...`);
        await db
          .update(users)
          .set({ telegram_chat_id: String(chatId) })
          .where(eq(users.id, decoded.userId));
        console.log('Database berhasil diupdate.'); // LOG 5

        console.log('Mengirim pesan sukses ke pengguna...');
        await bot.sendMessage(chatId, `✅ Berhasil! Akun JobTracker Anda telah terhubung. Anda akan menerima notifikasi pengingat melalui bot ini.`);
        console.log('Pesan sukses berhasil dikirim.'); // LOG 6
      } catch (e: any) {
        // Ini adalah blok paling penting jika terjadi error
        console.error('ERROR saat memproses token:', e.message); // LOG 7: Error spesifik
        await bot.sendMessage(chatId, `❌ Gagal! Token koneksi tidak valid atau sudah kedaluwarsa. Silakan buat tautan baru dari aplikasi JobTracker Anda.`);
      }
    } else {
      // Handle jika pengguna mengirim pesan lain
      await bot.sendMessage(chatId, `Untuk menghubungkan akun, silakan klik tombol "Hubungkan ke Telegram" dari dalam aplikasi JobTracker Anda.`);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('FATAL ERROR di webhook:', error.message);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
