import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Env-guarded Supabase client.
 *
 * Until VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set (see .env.example),
 * `supabase` is null and `isSupabaseConfigured` is false — the app falls back
 * to Phase-1 local behavior so nothing breaks before the backend exists.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anon);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anon as string)
  : null;
