
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Present' : 'Missing')

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL environment variable is not set. Please configure your Supabase integration.')
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY environment variable is not set. Please configure your Supabase integration.')
}

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
