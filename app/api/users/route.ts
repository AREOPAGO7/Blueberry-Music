import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const { username, email, password } = await request.json();

  const { data: user, error } = await supabase
    .from('users')
    .insert({ username, email, password })
    .select('id, username, email')
    .single();

  if (error) {
    return NextResponse.json({ 
      error: error.message || 'Failed to create user' 
    }, { status: 400 });
  }

  return NextResponse.json({ 
    success: true,
    user: { id: user.id, username: user.username, email: user.email }
  });
}
