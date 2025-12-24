import { createClient } from '@supabase/supabase-js';

// Use your actual Supabase URL and anon key
const supabaseUrl = 'https://goterudlqqcoclorgzhx.supabase.co';
// Get the anon key from your Supabase project settings
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvdGVydWRscXFjb2Nsb3Jnemh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MTQyMzUsImV4cCI6MjA4MjA5MDIzNX0.G6jVQ44eV3usBemI3umwAk0_qrzNpsu6CBOpYVCedRA'; // Replace with your actual anon key

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('businesses').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    console.log('✅ Supabase connected successfully');
    return true;
  } catch (err) {
    console.error('Supabase connection test failed:', err);
    return false;
  }
};