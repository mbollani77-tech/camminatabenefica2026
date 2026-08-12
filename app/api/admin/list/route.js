import { getSupabaseAdmin } from '../../../../lib/supabase';

export async function POST(request) {
  const { password } = await request.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: 'Password errata' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('participants')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return Response.json({ error: 'Errore nel recupero dati' }, { status: 500 });
  }

  return Response.json({ participants: data });
}
