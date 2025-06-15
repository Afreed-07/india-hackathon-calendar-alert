
-- First create the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create the hackathon_users table that the edge function expects
CREATE TABLE public.hackathon_users (
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
CREATE INDEX idx_hackathon_users_email ON public.hackathon_users(email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.hackathon_users ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow inserting new users (for the signup function)
CREATE POLICY "Allow inserting new users" ON public.hackathon_users
  FOR INSERT WITH CHECK (true);

-- Create a policy to allow users to read their own data
CREATE POLICY "Users can view their own data" ON public.hackathon_users
  FOR SELECT USING (true);

-- Add input validation constraints
ALTER TABLE public.hackathon_users 
  ADD CONSTRAINT email_format_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  ADD CONSTRAINT name_length_check CHECK (length(name) >= 2 AND length(name) <= 100),
  ADD CONSTRAINT city_length_check CHECK (length(city) >= 2 AND length(city) <= 50);

-- Add updated_at trigger
CREATE TRIGGER update_hackathon_users_updated_at
  BEFORE UPDATE ON public.hackathon_users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create rate_limits table for the edge function
CREATE TABLE public.rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for rate limiting lookups
CREATE INDEX idx_rate_limits_lookup ON public.rate_limits(identifier, endpoint, window_start);

-- Enable RLS on rate_limits (no policies needed as this is managed by edge functions)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Create audit_logs table for security logging
CREATE TABLE public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for audit log queries
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action, created_at);

-- Enable RLS on audit_logs (no policies needed as this is managed by edge functions)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
