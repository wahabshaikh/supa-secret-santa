import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(`Please add NEXT_PUBLIC_SUPABASE_URL to .env file`);
}

if (!supabaseAnonKey) {
  throw new Error(`Please add NEXT_PUBLIC_SUPABASE_ANON_KEY to .env file`);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
