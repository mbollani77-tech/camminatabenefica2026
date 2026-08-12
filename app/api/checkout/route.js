import Stripe from 'stripe';
import { getSupabaseAdmin } from '../../../lib/supabase';
import { getAmountForCategory } from '../../../lib/pricing';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { contact, participants, payment_method } = body;

    if (!contact?.email || !Array.isArray(participants) || participants.length === 0 || !payment_method) {
      return Response.json({ error: 'Dati mancanti o incompleti' }, { status: 400 });
    }

    for (const p of participants) {
      if (!p.first_name || !p.last_name || !p.category) {
        return Response.json({ error: 'Compila nome, cognome e categoria per ogni partecipante' }, { status: 400 });
      }
    }

    const supabase = getSupabaseAdmin();

    // Un group_id condiviso collega tutti i partecipanti della stessa iscrizione/pagamento
    const rows = participants.map((p) => ({
      first_name: p.first_name,
      last_name: p.last_name,
      email: contact.email,
      phone: contact.phone || null,
      category: p.category,
      amount: getAmountForCategory(p.category),
      payment_method,
      payment_status: 'pending',
    }));

    const { data: inserted, error: insertError } = await supabase
      .from('participants')
      .insert(rows)
      .select();

    if (insertError) throw insertError;

    const groupId = inserted[0].group_id;
    const total = rows.reduce((sum, r) => sum + r.amount, 0);

    // Se il totale è zero (es. solo partecipanti gratuiti), confermiamo subito senza pagamento
    if (total === 0) {
      await supabase.from('participants').update({ payment_status: 'paid' }).eq('group_id', groupId);
      return Response.json({ ok: true, groupId, free: true });
    }

    // Pagamento in loco: resta "pending" per tutto il gruppo fino al check-in
    if (payment_method === 'cash') {
      return Response.json({ ok: true, groupId });
    }

    // Pagamento carta: un'unica sessione Stripe per il totale del gruppo
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: contact.email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Camminata Benefica 20/09/2026 - iscrizione (${participants.length} partecipant${participants.length === 1 ? 'e' : 'i'})`,
            },
            unit_amount: Math.round(total * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?method=card`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      metadata: { group_id: groupId },
    });

    await supabase
      .from('participants')
      .update({ stripe_session_id: session.id })
      .eq('group_id', groupId);

    return Response.json({ ok: true, checkoutUrl: session.url });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Errore interno, riprova più tardi' }, { status: 500 });
  }
}
