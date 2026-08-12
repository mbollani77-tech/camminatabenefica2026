import Stripe from 'stripe';
import { getSupabaseAdmin } from '../../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe richiede il body "raw" (non parsato) per verificare la firma del webhook
export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Firma webhook non valida:', err.message);
    return Response.json({ error: 'Firma non valida' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const supabase = getSupabaseAdmin();

    await supabase
      .from('participants')
      .update({ payment_status: 'paid' })
      .eq('stripe_session_id', session.id);
  }

  return Response.json({ received: true });
}
