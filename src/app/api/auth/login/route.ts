import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email dan password harus diisi' }, { status: 400 });
    }

    const user = await db.select().from(users).where(eq(users.email, email));
    if (user.length === 0) {
      return NextResponse.json({ message: 'Email atau password salah' }, { status: 401 });
    }

    const isPasswordMatch = await bcrypt.compare(password, user[0].password);
    if (!isPasswordMatch) {
      return NextResponse.json({ message: 'Email atau password salah' }, { status: 401 });
    }

    const token = jwt.sign({ id: user[0].id, email: user[0].email }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    (await cookies()).set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60,
      path: '/',
    });

    return NextResponse.json({ message: 'Login berhasil' }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
