'use client';

import { useState } from 'react';

const CATEGORY_OPTIONS = [
  { value: 'adulto', label: 'Adulto', amount: 15.0 },
  { value: 'bambino', label: 'Bambino (fino a 13 anni)', amount: 5.0 },
  { value: 'senior', label: 'Over 65', amount: 0.0 },
  { value: 'agevolata', label: 'Disabili', amount: 0.0 },
];

function amountFor(category) {
  return CATEGORY_OPTIONS.find((c) => c.value === category).amount;
}

function emptyParticipant() {
  return { first_name: '', last_name: '', category: 'adulto' };
}

export default function Iscrizione() {
  const [contact, setContact] = useState({ email: '', phone: '' });
  const [participants, setParticipants] = useState([emptyParticipant()]);
  const [payment_method, setPaymentMethod] = useState('card');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [photoConsent, setPhotoConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = participants.reduce((sum, p) => sum + amountFor(p.category), 0);

  function updateParticipant(index, field, value) {
    setParticipants((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function addParticipant() {
    setParticipants((prev) => [...prev, emptyParticipant()]);
  }

  function removeParticipant(index) {
    setParticipants((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!privacyConsent) {
      setError("Devi accettare l'informativa sulla privacy per procedere.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact,
          participants,
          payment_method,
          privacy_consent: privacyConsent,
          photo_consent: photoConsent,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Errore durante l'iscrizione");
      }

      if (data.free) {
        window.location.href = '/success?method=free';
      } else if (payment_method === 'card' && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        window.location.href = '/success?method=cash';
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 560, margin: '0 auto', padding: '0 0 40px' }}>
      {/* Header compatto con link per tornare indietro */}
      <div className="banner-block" style={{ textAlign: 'left' }}>
        <a href="/" style={{ color: '#fff', fontSize: 13, opacity: 0.9, textDecoration: 'none' }}>
          ← Torna alle informazioni sull'evento
        </a>
        <h1 className="display" style={{ margin: '10px 0 0', fontSize: 26, fontWeight: 700 }}>
          Iscriviti alla camminata
        </h1>
        <p style={{ margin: '6px 0 0', fontSize: 14, opacity: 0.95 }}>
          Domenica 20 settembre 2026 — 2ª edizione
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '24px 20px 0' }}>
        <div>
          <p style={{ fontSize: 13, color: 'var(--slate)', marginBottom: 8 }}>
            Dati di contatto (valgono per tutto il gruppo)
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              required
              type="email"
              placeholder="Email"
              value={contact.email}
              onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
              className="field"
            />
            <input
              placeholder="Telefono (opzionale)"
              value={contact.phone}
              onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
              className="field"
            />
          </div>
        </div>

        <div>
          <p style={{ fontSize: 13, color: 'var(--slate)', marginBottom: 8 }}>Partecipanti</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {participants.map((p, i) => (
              <div key={i} className="card" style={{ padding: 12 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input
                    required
                    placeholder="Nome"
                    value={p.first_name}
                    onChange={(e) => updateParticipant(i, 'first_name', e.target.value)}
                    className="field"
                    style={{ flex: 1 }}
                  />
                  <input
                    required
                    placeholder="Cognome"
                    value={p.last_name}
                    onChange={(e) => updateParticipant(i, 'last_name', e.target.value)}
                    className="field"
                    style={{ flex: 1 }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <select
                    value={p.category}
                    onChange={(e) => updateParticipant(i, 'category', e.target.value)}
                    className="field"
                    style={{ flex: 1 }}
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label} — €{c.amount.toFixed(2)}
                      </option>
                    ))}
                  </select>
                  {participants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeParticipant(i)}
                      className="btn-remove"
                      aria-label="Rimuovi partecipante"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={addParticipant} className="btn-ghost" style={{ marginTop: 10 }}>
            + Aggiungi un altro partecipante
          </button>
        </div>

        <div>
          <p style={{ fontSize: 13, color: 'var(--slate)', marginBottom: 8 }}>Metodo di pagamento</p>
          <div style={{ display: 'flex', gap: 16, fontSize: 14 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="radio" checked={payment_method === 'card'} onChange={() => setPaymentMethod('card')} />
              Paga ora online (carta)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="radio" checked={payment_method === 'cash'} onChange={() => setPaymentMethod('cash')} />
              Pagamento in loco
            </label>
          </div>
        </div>

        <div className="card" style={{ fontWeight: 700, color: 'var(--sky-deep)', fontFamily: 'Fredoka, sans-serif' }}>
          Totale ({participants.length} partecipant{participants.length === 1 ? 'e' : 'i'}): €{total.toFixed(2)}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--slate)' }}>
            <input
              type="checkbox"
              checked={privacyConsent}
              onChange={(e) => setPrivacyConsent(e.target.checked)}
              style={{ marginTop: 3 }}
              required
            />
            <span>
              Ho letto e accetto l'<a href="/privacy" target="_blank" style={{ color: 'var(--sky-deep)' }}>informativa sulla privacy</a> *
            </span>
          </label>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--slate)' }}>
            <input
              type="checkbox"
              checked={photoConsent}
              onChange={(e) => setPhotoConsent(e.target.checked)}
              style={{ marginTop: 3 }}
            />
            <span>
              Autorizzo l'utilizzo di foto e video ripresi durante l'evento sul sito e sui canali social (opzionale)
            </span>
          </label>
        </div>

        {error && <div style={{ color: '#b91c1c', fontSize: 14 }}>{error}</div>}

        <button type="submit" disabled={loading} className="btn-primary">
          {loading
            ? 'Attendere...'
            : total === 0
            ? 'Confermo iscrizione gratuita'
            : payment_method === 'card'
            ? 'Vai al pagamento'
            : 'Confermo, pagherò in loco'}
        </button>
      </form>
    </main>
  );
}
