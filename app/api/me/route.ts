import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  const token = cookies().get('token')?.value;

  if (!token) return NextResponse.json({ user: null });

  const user = verifyToken(token);

  return NextResponse.json({ user });
}
