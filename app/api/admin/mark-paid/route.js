import { getSupabaseAdmin } from '../../../../lib/supabase';

export async function POST(request) {
  const { password, group_id, status } = await request.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: 'Password errata' }, { status: 401 });
  }
  if (!group_id) {
    return Response.json({ error: 'group_id mancante' }, { status: 400 });
  }

  const newStatus = status === 'pending' ? 'pending' : 'paid';

  const supabase = getSupabaseAdmin();
  // Sicurezza extra: si può cambiare stato manualmente solo per il pagamento "in loco" (cash).
  // I pagamenti con carta sono confermati automaticamente da Stripe e non vanno alterati a mano.
  const { error } = await supabase
    .from('participants')
    .update({ payment_status: newStatus })
    .eq('group_id', group_id)
    .eq('payment_method', 'cash');

  if (error) {
    return Response.json({ error: 'Errore aggiornamento' }, { status: 500 });
  }

  return Response.json({ ok: true });
}
