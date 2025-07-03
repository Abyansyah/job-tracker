import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { fullName, email, password } = await request.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({ message: 'Semua field harus diisi' }, { status: 400 });
    }

    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return NextResponse.json({ message: 'Email sudah terdaftar' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      name: fullName,
      email: email,
      password: hashedPassword,
    });

    return NextResponse.json({ message: 'Registrasi berhasil' }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
