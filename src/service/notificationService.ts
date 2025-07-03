import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN!;
const bot = new TelegramBot(token);

export async function sendTelegramReminder(user: any, job: any) {
  try {
    const chatId = user.telegram_chat_id;
    if (!chatId) return;

    const interviewDate = new Date(job.interview_date).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });

    const message = `
🔔 *Pengingat Wawancara* 🔔

Halo *${user.name}*,

Jangan lupa, Anda memiliki jadwal wawancara untuk posisi *${job.position_applied}* di *${job.company_name}*.

🗓️ *Jadwal:* ${interviewDate}

Semoga berhasil! ✨
    `;

    await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error(`Gagal mengirim pesan Telegram ke ${user.name}:`, error);
  }
}
