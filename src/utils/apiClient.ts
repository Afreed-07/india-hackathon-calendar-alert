
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface SignupData {
  name: string;
  email: string;
  city: string;
  notifications: {
    dailyUpdates: boolean;
    eventReminders: boolean;
    weeklyDigest: boolean;
  };
}

export const signupUser = async (userData: SignupData) => {
  const { data, error } = await supabase.functions.invoke('signup-user', {
    body: userData
  })

  if (error) {
    throw new Error(error.message || 'Failed to sign up user')
  }

  return data
}
