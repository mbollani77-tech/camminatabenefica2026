import { createClient } from '@supabase/supabase-js';

// Client "server-side": usa la service_role key, ha pieni permessi.
// Va usato SOLO nelle API routes (app/api/...), mai esposto al browser.
export function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
