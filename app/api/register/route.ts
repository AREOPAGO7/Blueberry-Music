import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json({ 
        error: 'Missing required fields: username, email, password' 
      }, { status: 400 });
    }

    const hashedPassword = hashPassword(password);

    console.log('Attempting to insert user:', { username, email });

    // Insert user into Supabase
    const { data: user, error } = await supabase
      .from('users')
      .insert({ username, email, password: hashedPassword })
      .select('id, username, email')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ 
        error: error.message || 'Registration failed',
        details: error
      }, { status: 400 });
    }

    console.log('User created successfully:', user);

    return NextResponse.json({ 
      success: true,
      user: { id: user.id, username: user.username, email: user.email }
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
