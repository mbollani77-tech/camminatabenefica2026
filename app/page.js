import ShareButtons from './components/ShareButtons';

export default function Home() {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', background: '#fff' }}>
      {/* Testata: immagine reale con titolo sovrapposto semi-trasparente */}
      <div style={{ position: 'relative' }}>
        <img src="/header.jpg" alt="Camminata benefica" style={{ width: '100%', display: 'block' }} />
        <div className="hero-title-overlay">
          <h1 style={{ margin: 0, fontSize: 48, fontWeight: 400, color: '#fff', fontFamily: "'Anton', sans-serif", textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Camminata benefica
          </h1>
        </div>
      </div>

      {/* Contenuti dinamici, in due colonne per restare compatti */}
      <div className="content-grid">
        <div className="content-main">
          <p className="poster-body">
            Ci sono passi che ci portano avanti. E ce ne sono altri che possono aiutare ad
            andare avanti anche chi ci sta accanto.
          </p>

          <p className="poster-body">
            <strong>Soluzioni per tutti i passi</strong> nasce con questo spirito: trasformare
            una semplice camminata in un momento di incontro, inclusione e solidarietà, capace
            di unire persone, famiglie, associazioni e realtà del nostro territorio.
          </p>

          <p className="poster-body">
            Il 4 ottobre 2026, a Sabbio Chiese, torniamo a camminare insieme per la seconda
            edizione della nostra camminata benefica: 3 km aperti a tutti, senza distinzioni di
            età o abilità, perché crediamo che il valore di una comunità si misuri anche dalla
            capacità di non lasciare indietro nessuno.
          </p>

          <p className="poster-body">
            Per Soluzioni Informatiche significa qualcosa di più che organizzare un evento:
            significa restituire valore al territorio nel quale lavoriamo e cresciamo ogni
            giorno, mettendo a disposizione energie, persone e relazioni per sostenere chi
            dedica il proprio tempo agli altri. E soprattutto significa farlo insieme.
          </p>

          <div>
            <p className="poster-label">All'arrivo</p>
            <p className="poster-body">
              Al Parco La Fratta la giornata continuerà con stand gastronomico, attività per
              bambini, laboratorio della creta (Artea), battesimo della sella (Centro Ippico
              Ambassador) e balli di gruppo: un'occasione per stare insieme e trasformare la
              solidarietà in una vera giornata di comunità.
            </p>
          </div>

          <div>
            <p className="poster-label" style={{ color: 'var(--meadow)' }}>
              Tutto il ricavato sarà devoluto in beneficenza
            </p>
            <p className="poster-body">Alle associazioni Spazi Divergenti e Sotto lo stesso cielo.</p>
          </div>

          <p className="poster-body" style={{ fontStyle: 'italic', color: 'var(--slate)' }}>
            Un passo da soli è solo un passo. Tanti passi insieme possono fare la differenza.
            <br />
            Ti aspettiamo il 4 ottobre. Cammina con noi.
          </p>

          <ShareButtons />

          <p className="poster-contact-bar">
            INFO: Manuela Bonacina <a href="tel:+393391055143">339 105 5143</a>
            <span className="contact-sep">·</span>
            Silvia Dolcetti <a href="tel:+393397053883">339 705 3883</a>
          </p>
        </div>

        <div className="content-side">
          <div>
            <p className="poster-edition">2ª EDIZIONE</p>
            <p className="poster-daynum">4</p>
            <p className="poster-month">OTTOBRE 2026</p>
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

          <a href="/admin" style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', textAlign: 'center', textDecoration: 'none' }}>
            Admin
          </a>
        </div>
      </div>

      {/* Footer: loghi sponsor reali (grandi e leggibili) */}
      <div className="poster-sponsors-bar">
        <div className="sponsor-row">
          <div className="sponsor-card">
            <img src="/sponsors/ambassador.png" alt="Centro Ippico Ambassador" className="sponsor-logo" />
          </div>
          <div className="sponsor-card">
            <img src="/sponsors/sotto-cielo.png" alt="Sotto lo stesso cielo" className="sponsor-logo" />
          </div>
          <div className="sponsor-card">
            <img src="/sponsors/spazi-divergenti.png" alt="Spazi Divergenti" className="sponsor-logo" />
          </div>
          <div className="sponsor-card">
            <img src="/sponsors/artea.png" alt="Artea 2010" className="sponsor-logo" />
          </div>
          <div className="sponsor-card">
            <img src="/sponsors/comune.png" alt="Comune di Sabbio Chiese" className="sponsor-logo" />
          </div>
        </div>
      </div>
    </main>
  );
}
