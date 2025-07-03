import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    (await cookies()).set('token', '', { httpOnly: true, maxAge: 0, path: '/' });
    return NextResponse.json({ message: 'Logout berhasil' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
