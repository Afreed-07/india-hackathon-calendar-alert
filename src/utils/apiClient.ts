
import { supabase } from '@/integrations/supabase/client';

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
  });

  if (error) {
    throw new Error(error.message || 'Failed to sign up user');
  }

  return data;
};
