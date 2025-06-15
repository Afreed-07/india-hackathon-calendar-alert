
import { supabase } from '@/integrations/supabase/client';

export const debugAuthState = async () => {
  console.log('=== AUTH DEBUG START ===');
  
  // Check session
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  console.log('Session data:', sessionData);
  console.log('Session error:', sessionError);
  
  // Check user
  const { data: userData, error: userError } = await supabase.auth.getUser();
  console.log('User data:', userData);
  console.log('User error:', userError);
  
  // Check if we can access any protected tables
  try {
    const { data: profileTest, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    console.log('Profiles table access:', { data: profileTest, error: profileError });
  } catch (e) {
    console.log('Profiles table error:', e);
  }
  
  try {
    const { data: eventsTest, error: eventsError } = await supabase
      .from('user_events')
      .select('id')
      .limit(1);
    console.log('User_events table access:', { data: eventsTest, error: eventsError });
  } catch (e) {
    console.log('User_events table error:', e);
  }
  
  console.log('=== AUTH DEBUG END ===');
};
