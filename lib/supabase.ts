import { createClient } from "@supabase/supabase-js";

// Provide dummy values to prevent initialization crash during build
// The actual API calls are guarded by checking if the real env vars exist in lib/api.ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseKey = typeof window === "undefined" && supabaseServiceKey
  ? supabaseServiceKey
  : supabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseKey);
