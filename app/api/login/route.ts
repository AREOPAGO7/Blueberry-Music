import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Get user from Supabase
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: 'user not found' }, { status: 401 });
  }

  if (!comparePassword(password, user.password)) {
    return NextResponse.json({ error: 'incorrect password' }, { status: 401 });
  }

  const token = generateToken({ id: user.id, username: user.username, email: user.email });

  const response = NextResponse.json({ 
    success: true,
    user: { id: user.id, username: user.username, email: user.email }
  });
 
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
  
  return response;
}
