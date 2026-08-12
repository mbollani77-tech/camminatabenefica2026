export default function Home() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', background: '#fff' }}>
      {/* Testata: immagine reale con titolo sovrapposto semi-trasparente */}
      <div style={{ position: 'relative' }}>
        <img src="/header.jpg" alt="Camminata benefica" style={{ width: '100%', display: 'block' }} />
        <div className="hero-title-overlay">
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: 400, color: '#fff', fontFamily: "'Anton', sans-serif", textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Camminata benefica
          </h1>
        </div>
      </div>

      {/* Contenuti dinamici, in due colonne per restare compatti */}
      <div className="content-grid">
        <div className="content-main">
          <p className="poster-body">
            Unisciti a noi per una giornata di movimento, solidarietà e condivisione!
            Questa camminata è aperta a tutti, senza limiti di età, abilità o provenienza.
            Camminiamo fianco a fianco per promuovere l'inclusione sociale, il rispetto
            delle diversità e il sostegno a chi ha più bisogno.
          </p>

          <div>
            <p className="poster-label">All'arrivo</p>
            <p className="poster-body">
              Stand gastronomico · laboratorio della creta (Artea) · battesimo della sella
              (Centro Ippico Ambassador) · trucca bimbi · balli di gruppo.
            </p>
          </div>

          <div>
            <p className="poster-label" style={{ color: 'var(--meadow)' }}>
              Tutto il ricavato sarà devoluto in beneficenza
            </p>
            <p className="poster-body">Alle associazioni Pedalabile e Sotto lo stesso cielo.</p>
          </div>
        </div>

        <div className="content-side">
          <div>
            <p className="poster-edition">2ª EDIZIONE</p>
            <p className="poster-daynum">20</p>
            <p className="poster-month">SETTEMBRE 2026</p>
          </div>

          <div className="side-divider">
            <p className="poster-label" style={{ color: '#fff' }}>Ritrovo</p>
            <p className="poster-ritrovo">
              Parcheggio Le Vele, Sabbio Chiese, dalle ore 9:30<br />
              <strong>Partenza ore 10:30</strong> direzione Parco La Fratta (3 km)
            </p>
          </div>

          <div className="poster-cta-box">
            <p className="quota-line" style={{ marginTop: 0 }}>Info e iscrizione</p>
            <p>Quota (assicurazione, gadget, maglietta)</p>
            <p className="quota-line">€15 adulti · €5 bambini fino 13 anni</p>
            <p>Gratuita over 65 e disabili</p>
            <a href="/iscrizione" className="btn-primary btn-link" style={{ marginTop: 10, display: 'block' }}>
              Iscriviti →
            </a>
          </div>
        </div>
      </div>

      {/* Footer: immagine reale (sponsor + contatti) */}
      <img src="/footer.jpg" alt="Sponsor e contatti" style={{ width: '100%', display: 'block' }} />
    </main>
  );
}
