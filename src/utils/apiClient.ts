
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Present' : 'Missing')

// Only create the client if both URL and key are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

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
  if (!supabase) {
    throw new Error('Supabase is not configured. Please connect your Lovable project to Supabase first by clicking the green Supabase button in the top right corner.')
  }

  const { data, error } = await supabase.functions.invoke('signup-user', {
    body: userData
  })

  if (error) {
    throw new Error(error.message || 'Failed to sign up user')
  }

  return data
}
