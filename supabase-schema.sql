-- Create users table in Supabase
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Allow insert for registration" ON users;

-- Create policy to allow all operations for now (we'll secure this later)
CREATE POLICY "Allow all operations" ON users
  FOR ALL USING (true) WITH CHECK (true);

-- Alternative: More restrictive policies (uncomment if you want more security)
-- CREATE POLICY "Allow insert for registration" ON users
--   FOR INSERT WITH CHECK (true);
-- 
-- CREATE POLICY "Allow select for authentication" ON users
--   FOR SELECT USING (true);
-- 
-- CREATE POLICY "Allow update own data" ON users
--   FOR UPDATE USING (auth.uid()::text = id::text); 