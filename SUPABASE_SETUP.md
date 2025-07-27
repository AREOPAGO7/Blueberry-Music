# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and anon key

## 2. Environment Variables

Create a `.env.local` file in your project root with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# JWT Secret (for token generation)
JWT_SECRET=your_jwt_secret_key
```

## 3. Database Setup

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Run the SQL from `supabase-schema.sql` to create the users table

## 4. Table Structure

The `users` table has the following structure:
- `id` (SERIAL PRIMARY KEY)
- `username` (VARCHAR(50) UNIQUE)
- `email` (VARCHAR(100) UNIQUE)
- `password` (TEXT)
- `created_at` (TIMESTAMP)

## 5. API Routes

All API routes now use Supabase:
- `/api/login` - User authentication
- `/api/register` - User registration
- `/api/me` - Get current user
- `/api/logout` - User logout
- `/api/users` - Create user (legacy)

## 6. Features

- ✅ User registration with password hashing
- ✅ User login with JWT tokens
- ✅ Session management with cookies
- ✅ Row Level Security (RLS) enabled
- ✅ Error handling for duplicate emails/usernames
- ✅ Same API response format as before 