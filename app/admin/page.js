'use client';

import { useState } from 'react';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function login(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/admin/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || 'Errore');
      return;
    }
    setParticipants(data.participants);
    setAuthed(true);
  }

  async function markGroupPaid(group_id) {
    await fetch('/api/admin/mark-paid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, group_id }),
    });
    setParticipants((prev) =>
      prev.map((p) => (p.group_id === group_id ? { ...p, payment_status: 'paid' } : p))
    );
  }

  function exportCsv() {
    const headers = ['Codice iscrizione', 'Nome', 'Cognome', 'Email', 'Telefono', 'Categoria', 'Importo', 'Metodo', 'Stato', 'Data'];
    const rows = participants.map((p) => [
      p.group_id.slice(0, 8),
      p.first_name,
      p.last_name,
      p.email,
      p.phone || '',
      p.category,
      p.amount,
      p.payment_method === 'card' ? 'Online (carta)' : 'In loco',
      p.payment_status,
      new Date(p.created_at).toLocaleString('it-IT'),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'partecipanti.csv';
    a.click();
  }

  if (!authed) {
    return (
      <main style={{ maxWidth: 360, margin: '80px auto', padding: 20 }}>
        <h1 style={{ fontSize: 20 }}>Accesso admin</h1>
        <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: 10, borderRadius: 8, border: '1px solid #d6d3d1' }}
          />
          {error && <div style={{ color: '#b91c1c' }}>{error}</div>}
          <button
            type="submit"
            disabled={loading}
            style={{ padding: 10, borderRadius: 8, border: 'none', background: '#16a34a', color: '#fff', fontWeight: 600 }}
          >
            {loading ? 'Attendere...' : 'Entra'}
          </button>
        </form>
      </main>
    );
  }

  const totalPaid = participants.filter((p) => p.payment_status === 'paid').length;
  const groupCount = new Set(participants.map((p) => p.group_id)).size;

  return (
    <main style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ fontSize: 20 }}>
          Partecipanti: {participants.length} ({groupCount} iscrizioni) · Pagati: {totalPaid}
        </h1>
        <button
          onClick={exportCsv}
          style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: '#0f766e', color: '#fff', fontWeight: 600 }}
        >
          Esporta CSV
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #e7e5e4' }}>
              {['Iscrizione', 'Nome', 'Email', 'Categoria', 'Importo', 'Metodo', 'Stato', 'Azione'].map((h) => (
                <th key={h} style={{ padding: 8, fontSize: 13, color: '#57534e' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {participants.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f0efee' }}>
                <td style={{ padding: 8, fontSize: 12, color: '#a8a29e' }}>{p.group_id.slice(0, 8)}</td>
                <td style={{ padding: 8 }}>{p.first_name} {p.last_name}</td>
                <td style={{ padding: 8 }}>{p.email}</td>
                <td style={{ padding: 8 }}>{p.category}</td>
                <td style={{ padding: 8 }}>€{p.amount}</td>
                <td style={{ padding: 8 }}>{p.payment_method === 'card' ? 'Online (carta)' : 'In loco'}</td>
                <td style={{ padding: 8 }}>
                  {p.payment_status === 'paid' ? '✅ Pagato' : '⏳ In attesa'}
                </td>
                <td style={{ padding: 8 }}>
                  {p.payment_status !== 'paid' && p.payment_method === 'cash' && (
                    <button
                      onClick={() => markGroupPaid(p.group_id)}
                      style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #16a34a', background: '#fff', color: '#16a34a', cursor: 'pointer' }}
                    >
                      Segna gruppo pagato in loco
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
