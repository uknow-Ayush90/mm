import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("[project-ref]")) return null;
  _supabase = createClient(url, key);
  return _supabase;
}

function makeNoop(): SupabaseClient {
  return new Proxy({} as SupabaseClient, {
    get(_, prop) {
      if (prop === "channel") {
        return () => ({
          on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) }),
          subscribe: () => ({ unsubscribe: () => {} }),
        });
      }
      if (prop === "removeChannel") return () => Promise.resolve();
      return () => makeNoop();
    },
  });
}

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const client = getSupabase();
    if (!client) return (makeNoop() as unknown as Record<string | symbol, unknown>)[prop];
    return (client as unknown as Record<string | symbol, unknown>)[prop];
  },
});
