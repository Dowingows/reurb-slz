import { createClient } from "@supabase/supabase-js";

// Cliente público para uso no browser (sem service role key)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
