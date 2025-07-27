import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const token = cookies().get('token')?.value;

  if (!token) return NextResponse.json({ user: null });

  const decoded = verifyToken(token);
  
  if (!decoded || !decoded.id) {
    return NextResponse.json({ user: null });
  }

  // Get user from Supabase
  const { data: user, error } = await supabase
    .from('users')
    .select('id, username, email')
    .eq('id', decoded.id)
    .single();

  if (error || !user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user });
}
