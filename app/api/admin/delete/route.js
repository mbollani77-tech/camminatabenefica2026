import { getSupabaseAdmin } from '../../../../lib/supabase';

export async function POST(request) {
  const { password, id, restore } = await request.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: 'Password errata' }, { status: 401 });
  }
  if (!id) {
    return Response.json({ error: 'ID mancante' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  // Eliminazione logica: il record resta nel database (is_deleted = true) e può
  // essere ripristinato in qualsiasi momento richiamando questa stessa API con restore: true.
  const { error } = await supabase
    .from('participants')
    .update({ is_deleted: !restore })
    .eq('id', id);

  if (error) {
    return Response.json({ error: 'Errore eliminazione' }, { status: 500 });
  }

  return Response.json({ ok: true });
}
