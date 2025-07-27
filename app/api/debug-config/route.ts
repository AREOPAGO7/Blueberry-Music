import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const jwtSecret = process.env.JWT_SECRET;

  return NextResponse.json({
    config: {
      supabaseUrl: supabaseUrl ? 'Set' : 'Missing',
      supabaseKey: supabaseKey ? 'Set' : 'Missing',
      jwtSecret: jwtSecret ? 'Set' : 'Missing',
    },
    environment: process.env.NODE_ENV,
    message: 'Check the config object to see if environment variables are set'
  });
} 