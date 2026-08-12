export default function Success({ searchParams }) {
  const method = searchParams?.method;

  const message =
    method === 'cash'
      ? "Ti aspettiamo il giorno dell'evento: completa il pagamento (contanti o carta, in base a cosa sarà disponibile) al check-in, prima della partenza."
      : method === 'free'
      ? 'La tua iscrizione gratuita è confermata. Ti aspettiamo il giorno dell\'evento!'
      : 'Il pagamento è andato a buon fine. Riceverai una email di conferma a breve.';

  return (
    <main style={{ maxWidth: 480, margin: '0 auto' }}>
      <div className="banner-block" style={{ textAlign: 'center' }}>
        <h1 className="display" style={{ margin: 0, fontSize: 26 }}>Sei nel gruppo!</h1>
        <p style={{ margin: '8px 0 0', fontWeight: 600 }}>Domenica 20 settembre 2026</p>
      </div>
      <img src="/hero-compact.jpg" alt="Soluzioni per tutti i passi" className="hero-image-compact" />

      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p className="poster-body" style={{ fontWeight: 600 }}>{message}</p>

        <div style={{ borderTop: '2px solid var(--sky-light)', paddingTop: 14 }}>
          <p className="poster-label">Dove e quando</p>
          <p className="poster-body">
            Ritrovo al Parcheggio Le Vele, Sabbio Chiese, dalle 9:30. Partenza ore 10:30
            verso Parco La Fratta (3 km).
          </p>
        </div>

        <div style={{ borderTop: '2px solid var(--sky-light)', paddingTop: 14 }}>
          <p className="poster-label">Cosa ricevi con la quota</p>
          <p className="poster-body">Assicurazione, gadget e maglietta dell'evento (ritiro al check-in).</p>
        </div>

        <div style={{ borderTop: '2px solid var(--sky-light)', paddingTop: 14 }}>
          <p className="poster-label">All'arrivo</p>
          <p className="poster-body">
            Stand gastronomico, laboratorio della creta (Artea), battesimo della sella
            (Centro Ippico Ambassador), trucca bimbi e balli di gruppo.
          </p>
        </div>

        <div style={{ borderTop: '2px solid var(--sky-light)', paddingTop: 14 }}>
          <p className="poster-label" style={{ color: 'var(--meadow)' }}>Il ricavato va a</p>
          <p className="poster-body">Associazioni Pedalabile e Sotto lo stesso cielo.</p>
        </div>
      </div>

      <div style={{ background: 'var(--sky-deep)', color: '#fff', padding: '18px 20px', textAlign: 'center', fontSize: 13, marginTop: 8 }}>
        Info: Manuela Bonacina 339 105 5143 · Silvia Dolcetti 339 705 3883
      </div>
    </main>
  );
}
