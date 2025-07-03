import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    const { password, ...userProfile } = user;
    return NextResponse.json(userProfile);
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ message: 'Tidak terautentikasi' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Gagal mengambil data profil' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    const { name, email, no_telephone } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ message: 'Nama dan email harus diisi' }, { status: 400 });
    }

    if (email !== user.email) {
      const existingUser = await db.select().from(users).where(eq(users.email, email));
      if (existingUser.length > 0) {
        return NextResponse.json({ message: 'Email sudah digunakan' }, { status: 409 });
      }
    }

    const updatedUser = await db.update(users).set({ name, email, no_telephone }).where(eq(users.id, user.id)).returning({
      id: users.id,
      name: users.name,
      email: users.email,
      no_telephone: users.no_telephone,
    });

    return NextResponse.json(updatedUser[0]);
  } catch (error) {
    return NextResponse.json({ message: 'Gagal memperbarui profil' }, { status: 500 });
  }
}
