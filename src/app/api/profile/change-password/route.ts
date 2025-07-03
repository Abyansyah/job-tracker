import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: 'Semua field harus diisi' }, { status: 400 });
    }

    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json({ message: 'Password saat ini salah' }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.update(users).set({ password: hashedPassword }).where(eq(users.id, user.id));

    return NextResponse.json({ message: 'Password berhasil diubah' });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal mengubah password' }, { status: 500 });
  }
}