import { getSupabaseAdmin } from '../../../lib/supabase';

// Endpoint di "keep-alive": esegue una query minima su Supabase per
// generare attivita' reale sul database e impedire che il progetto
// (piano free) venga messo in pausa per inattivita'.
// Richiamato periodicamente da .github/workflows/keep-alive.yml
export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('participants')
      .select('id', { count: 'exact', head: true });

    if (error) {
      return Response.json({ ok: false, error: error.message }, { status: 500 });
    }

    return Response.json({ ok: true, ts: new Date().toISOString() });
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
