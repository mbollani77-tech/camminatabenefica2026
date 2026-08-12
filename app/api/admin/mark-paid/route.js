import { getSupabaseAdmin } from '../../../../lib/supabase';

export async function POST(request) {
  const { password, group_id } = await request.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: 'Password errata' }, { status: 401 });
  }
  if (!group_id) {
    return Response.json({ error: 'group_id mancante' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('participants')
    .update({ payment_status: 'paid' })
    .eq('group_id', group_id);

  if (error) {
    return Response.json({ error: 'Errore aggiornamento' }, { status: 500 });
  }

  return Response.json({ ok: true });
}
