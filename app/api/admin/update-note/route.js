import { getSupabaseAdmin } from '../../../../lib/supabase';

export async function POST(request) {
  const { password, id, note } = await request.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: 'Password errata' }, { status: 401 });
  }
  if (!id) {
    return Response.json({ error: 'ID mancante' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('participants').update({ note: note || null }).eq('id', id);

  if (error) {
    return Response.json({ error: 'Errore aggiornamento nota' }, { status: 500 });
  }

  return Response.json({ ok: true });
}
