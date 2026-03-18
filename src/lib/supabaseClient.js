// Supabase client setup
// Replace with your actual Supabase URL and anon key
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nknkoqmfltsynoxgtnys.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rbmtvcW1mbHRzeW5veGd0bnlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjM4MjcsImV4cCI6MjA4ODk5OTgyN30.NnhuPJlOXPln11TLMrSXcMWcgRs-3YPp0ipc1jR9TA4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: window.localStorage, // Explicitly set to localStorage for session persistence
  },
});
