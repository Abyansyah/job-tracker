import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Tidak terautentikasi' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string };

    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, decoded.id));

    if (user.length === 0) {
      return NextResponse.json({ message: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(user[0], { status: 200 });
  } catch (error) {
    console.error('Get me error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: 'Token tidak valid' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
