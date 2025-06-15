
import { supabase } from '@/integrations/supabase/client';

export interface UserEvent {
  id: string;
  user_id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  type: 'virtual' | 'offline' | 'hybrid';
  max_participants?: number;
  prize?: string;
  website?: string;
  organizer: string;
  registration_open: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventRegistration {
  id: string;
  user_id: string;
  event_id: string;
  registered_at: string;
}

export interface UserPreferences {
  user_id: string;
  dark_mode: boolean;
  email_notifications: boolean;
  event_reminders: boolean;
  created_at: string;
  updated_at: string;
}

// Event management functions
export const getUserEvents = async () => {
  console.log('getUserEvents called');
  const { data, error } = await supabase
    .from('user_events')
    .select('*')
    .order('start_date', { ascending: true });

  if (error) {
    console.error('getUserEvents error:', error);
    throw new Error(error.message);
  }

  console.log('getUserEvents success:', data);
  return data as UserEvent[];
};

export const createEvent = async (eventData: Omit<UserEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
  console.log('createEvent called with data:', eventData);
  
  // Get current session and user
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  console.log('Current session:', sessionData);
  console.log('Session error:', sessionError);
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  console.log('Current user from auth:', user);
  console.log('User error:', userError);
  
  if (!user || !sessionData.session) {
    const error = 'User must be authenticated to create events';
    console.error(error);
    console.error('User exists:', !!user);
    console.error('Session exists:', !!sessionData.session);
    throw new Error(error);
  }

  // Prepare the event data with user_id
  const eventWithUserId = {
    ...eventData,
    user_id: user.id
  };
  
  console.log('Inserting event into database with user_id:', user.id);
  console.log('Full event data to insert:', eventWithUserId);
  
  // Check if we can read from user_events table first
  console.log('Testing read access to user_events table...');
  const { data: testData, error: testError } = await supabase
    .from('user_events')
    .select('id')
    .limit(1);
  
  console.log('Test read result:', testData);
  console.log('Test read error:', testError);

  const { data, error } = await supabase
    .from('user_events')
    .insert(eventWithUserId)
    .select()
    .single();

  if (error) {
    console.error('Database insert error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error details:', error.details);
    console.error('Error hint:', error.hint);
    throw new Error(error.message);
  }

  console.log('Event created successfully:', data);
  return data as UserEvent;
};

export const updateEvent = async (eventId: string, eventData: Partial<UserEvent>) => {
  const { data, error } = await supabase
    .from('user_events')
    .update(eventData)
    .eq('id', eventId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as UserEvent;
};

export const deleteEvent = async (eventId: string) => {
  const { error } = await supabase
    .from('user_events')
    .delete()
    .eq('id', eventId);

  if (error) {
    throw new Error(error.message);
  }
};

// Registration functions
export const registerForEvent = async (eventId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to register for events');
  }

  const { data, error } = await supabase
    .from('event_registrations')
    .insert({
      user_id: user.id,
      event_id: eventId
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as EventRegistration;
};

export const unregisterFromEvent = async (eventId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated');
  }

  const { error } = await supabase
    .from('event_registrations')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message);
  }
};

export const getUserRegistrations = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated');
  }

  const { data, error } = await supabase
    .from('event_registrations')
    .select(`
      *,
      user_events (*)
    `)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// User preferences functions
export const getUserPreferences = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated');
  }

  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(error.message);
  }

  return data as UserPreferences | null;
};

export const updateUserPreferences = async (preferences: Partial<UserPreferences>) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated');
  }

  const { data, error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: user.id,
      ...preferences
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as UserPreferences;
};
