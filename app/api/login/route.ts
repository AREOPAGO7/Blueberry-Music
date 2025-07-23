import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { comparePassword, generateToken } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
export async function POST(request: Request) {
  const { email, password } = await request.json();

  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    return NextResponse.json({ error: 'user not found' }, { status: 401 });
  }
  if (!comparePassword(password, user.password)){
    return NextResponse.json({ error: 'incorrect password' }, { status: 401 });
  }

  const token = generateToken({ id: user.id, username: user.username, email: user.email });

  const response = NextResponse.json({ success: true });
 
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
  
  return response;
}
