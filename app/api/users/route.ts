import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';

export async function POST(request: Request) {
  const { username, email, password } = await request.json();

  await db.insert(users).values({ username, email, password });

  return NextResponse.json({ success: true });
}
