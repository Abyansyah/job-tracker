import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    throw new Error('Not authenticated');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string };
  const user = await db.select().from(users).where(eq(users.id, decoded.id));

  if (user.length === 0) {
    throw new Error('User not found');
  }

  return user[0];
}
