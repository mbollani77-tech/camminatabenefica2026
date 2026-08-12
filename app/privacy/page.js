export default function Privacy() {
  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '32px 20px 60px' }}>
      <a href="/iscrizione" style={{ color: 'var(--sky-deep)', fontSize: 14, textDecoration: 'none' }}>
        ← Torna all'iscrizione
      </a>

      <h1 className="display" style={{ fontSize: 24, color: 'var(--sky-deep)', marginTop: 16 }}>
        Informativa sulla privacy
      </h1>
      <p style={{ fontSize: 13, color: 'var(--slate)' }}>
        Ai sensi degli articoli 13 e 14 del Regolamento UE 2016/679 (GDPR)
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 20 }}>
        <div>
          <p className="poster-label">Titolare del trattamento</p>
          <p className="poster-body">
            Il Titolare del trattamento dei dati è l'organizzazione promotrice della
            Camminata Benefica. Per qualsiasi richiesta relativa al trattamento dei
            tuoi dati puoi contattare: Manuela Bonacina (339 105 5143) o Silvia
            Dolcetti (339 705 3883).
          </p>
        </div>

        <div>
          <p className="poster-label">Dati raccolti</p>
          <p className="poster-body">
            Nome, cognome, email, telefono (opzionale), categoria di iscrizione e
            importo della quota. Non raccogliamo dati sanitari o altre categorie
            particolari di dati: le agevolazioni per disabilità sono gestite tramite
            una categoria generica "quota agevolata", senza richiedere dettagli sulla
            condizione specifica.
          </p>
        </div>

        <div>
          <p className="poster-label">Finalità del trattamento</p>
          <p className="poster-body">
            I dati sono trattati per: gestire l'iscrizione e la partecipazione
            all'evento, elaborare il pagamento della quota, inviare comunicazioni
            organizzative relative alla camminata (es. variazioni di programma).
            Non utilizziamo i tuoi dati per finalità di marketing senza un consenso
            specifico separato.
          </p>
        </div>

        <div>
          <p className="poster-label">Base giuridica</p>
          <p className="poster-body">
            Il trattamento si basa sull'esecuzione di un contratto (l'iscrizione
            all'evento) e, per l'eventuale utilizzo di foto e video, sul consenso
            specifico che ti viene richiesto in fase di iscrizione.
          </p>
        </div>

        <div>
          <p className="poster-label">Conservazione dei dati</p>
          <p className="poster-body">
            I dati raccolti sono conservati per il tempo necessario
            all'organizzazione dell'evento e agli adempimenti amministrativi
            conseguenti, e saranno cancellati entro 12 mesi dalla data dell'evento,
            salvo obblighi di legge diversi.
          </p>
        </div>

        <div>
          <p className="poster-label">Comunicazione a terzi</p>
          <p className="poster-body">
            I dati relativi al pagamento con carta sono trattati da Stripe
            (fornitore del servizio di pagamento) secondo la sua informativa
            privacy. I dati non sono venduti né comunicati a terzi per finalità
            commerciali.
          </p>
        </div>

        <div>
          <p className="poster-label">Foto e video dell'evento</p>
          <p className="poster-body">
            Durante la camminata potrebbero essere scattate foto o realizzati video.
            Se hai dato il consenso in fase di iscrizione, queste immagini potranno
            essere pubblicate su sito web e canali social dell'evento a scopo
            promozionale e di documentazione. Puoi revocare questo consenso in
            qualsiasi momento contattando gli organizzatori.
          </p>
        </div>

        <div>
          <p className="poster-label">I tuoi diritti</p>
          <p className="poster-body">
            Puoi richiedere in qualsiasi momento l'accesso, la rettifica o la
            cancellazione dei tuoi dati, oppure revocare i consensi forniti,
            contattando gli organizzatori ai riferimenti indicati sopra.
          </p>
        </div>
      </div>
    </main>
  );
}
