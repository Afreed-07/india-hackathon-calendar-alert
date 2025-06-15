
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute

// Input validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
};

const validateName = (name: string): boolean => {
  return typeof name === 'string' && name.length >= 2 && name.length <= 100 && name.trim().length > 0;
};

const validateCity = (city: string): boolean => {
  return typeof city === 'string' && city.length >= 2 && city.length <= 50 && city.trim().length > 0;
};

const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Rate limiting check
const checkRateLimit = async (supabaseClient: any, identifier: string, endpoint: string) => {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW);
  
  // Clean up old rate limit records
  await supabaseClient
    .from('rate_limits')
    .delete()
    .lt('window_start', windowStart.toISOString());

  // Check current rate limit
  const { data: rateLimitData, error: rateLimitError } = await supabaseClient
    .from('rate_limits')
    .select('request_count')
    .eq('identifier', identifier)
    .eq('endpoint', endpoint)
    .gte('window_start', windowStart.toISOString())
    .single();

  if (rateLimitError && rateLimitError.code !== 'PGRST116') {
    console.error('Rate limit check error:', rateLimitError);
    return false;
  }

  if (rateLimitData && rateLimitData.request_count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  // Update or create rate limit record
  if (rateLimitData) {
    await supabaseClient
      .from('rate_limits')
      .update({ request_count: rateLimitData.request_count + 1 })
      .eq('identifier', identifier)
      .eq('endpoint', endpoint)
      .gte('window_start', windowStart.toISOString());
  } else {
    await supabaseClient
      .from('rate_limits')
      .insert({
        identifier,
        endpoint,
        request_count: 1,
        window_start: new Date().toISOString()
      });
  }

  return true;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check rate limiting
    const rateLimitOk = await checkRateLimit(supabaseClient, clientIP, 'signup-user');
    if (!rateLimitOk) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const requestBody = await req.json()
    const { name, email, city, notifications } = requestBody

    // Input validation
    if (!validateEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!validateName(name)) {
      return new Response(
        JSON.stringify({ error: 'Name must be between 2 and 100 characters' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!validateCity(city)) {
      return new Response(
        JSON.stringify({ error: 'City must be between 2 and 50 characters' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!notifications || typeof notifications !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Invalid notifications preferences' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email.toLowerCase());
    const sanitizedCity = sanitizeInput(city);

    // Check for duplicate email
    const { data: existingUser, error: checkError } = await supabaseClient
      .from('hackathon_users')
      .select('email')
      .eq('email', sanitizedEmail)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing user:', checkError);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'Email already registered' }),
        {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Insert user data into the hackathon_users table
    const { data, error } = await supabaseClient
      .from('hackathon_users')
      .insert([
        {
          name: sanitizedName,
          email: sanitizedEmail,
          city: sanitizedCity,
          daily_updates: Boolean(notifications.dailyUpdates),
          event_reminders: Boolean(notifications.eventReminders),
          weekly_digest: Boolean(notifications.weeklyDigest),
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      console.error('Error inserting user:', error);
      
      // Log security event
      await supabaseClient
        .from('audit_logs')
        .insert({
          action: 'SIGNUP_FAILED',
          table_name: 'hackathon_users',
          new_values: { email: sanitizedEmail, error: error.message },
          ip_address: clientIP,
          user_agent: userAgent
        });

      return new Response(
        JSON.stringify({ error: 'Failed to create account. Please try again.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Log successful signup
    await supabaseClient
      .from('audit_logs')
      .insert({
        action: 'SIGNUP_SUCCESS',
        table_name: 'hackathon_users',
        record_id: data[0].id,
        new_values: { email: sanitizedEmail },
        ip_address: clientIP,
        user_agent: userAgent
      });

    console.log(`Successful signup for email: ${sanitizedEmail}`);

    return new Response(
      JSON.stringify({ success: true, user: { id: data[0].id, email: data[0].email } }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in signup-user function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
