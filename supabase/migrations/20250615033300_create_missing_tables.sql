
-- Create the missing tables that are referenced in the existing migrations but don't exist yet

-- Create rate_limits table (if not exists)
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for rate limiting lookups (if not exists)
CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup ON public.rate_limits(identifier, endpoint, window_start);

-- Enable RLS on rate_limits (if not already enabled)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Create audit_logs table (if not exists)
CREATE TABLE IF NOT EXISTS public.audit_logs (
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

-- Create index for audit log queries (if not exists)
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action, created_at);

-- Enable RLS on audit_logs (if not already enabled)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
