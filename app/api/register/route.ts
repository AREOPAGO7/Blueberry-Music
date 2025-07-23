import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  const { username, email, password } = await request.json();

  const hashedPassword = hashPassword(password);

  await db.insert(users).values({ username, email, password: hashedPassword });

  return NextResponse.json({ success: true });
}
