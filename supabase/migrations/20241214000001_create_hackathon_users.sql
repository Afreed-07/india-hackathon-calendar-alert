
-- Create a table for hackathon users
CREATE TABLE hackathon_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL,
  daily_updates BOOLEAN DEFAULT true,
  event_reminders BOOLEAN DEFAULT true,
  weekly_digest BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX idx_hackathon_users_email ON hackathon_users(email);

-- Enable Row Level Security (RLS)
ALTER TABLE hackathon_users ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow inserting new users
CREATE POLICY "Allow inserting new users" ON hackathon_users
  FOR INSERT WITH CHECK (true);

-- Create a policy to allow users to read their own data
CREATE POLICY "Users can view their own data" ON hackathon_users
  FOR SELECT USING (true);
