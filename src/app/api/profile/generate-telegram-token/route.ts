import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import jwt from 'jsonwebtoken';

export async function POST() {
  try {
    const user = await getCurrentUser();

    const connectionToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '10m' });

    return NextResponse.json({ token: connectionToken });
  } catch (error) {
    return NextResponse.json({ message: 'Gagal membuat token koneksi' }, { status: 500 });
  }
}
